var modelId = '';
var modelType = 'image-classification';
var models = [];
var visionServiceEndpoint = '';
var widthUnity = 1;
var heightUnity = 0.45;
var pixel = 0.001;

function captureVideoFrame(video, format, width, height) {
    if (typeof video === 'string') {
        video = document.querySelector(video);
    }
    format = format || 'jpeg';

    if (!video || (format !== 'png' && format !== 'jpeg')) {
        return false;
    }
    var canvas = document.createElement("CANVAS");
    canvas.width = width || video.videoWidth;
    canvas.height = height || video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    var dataUri = canvas.toDataURL('image/' + format);
    var data = dataUri.split(',')[1];
    var mimeType = dataUri.split(';')[0].slice(5)

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }
    var blob = new Blob([ arr ], { type: mimeType });
    return { blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height };
};

function analizeImage(callback){
    let frame = captureVideoFrame("video");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var r = JSON.parse(this.responseText);

            if(r.hasOwnProperty('labels') && r.labels !== null) {
              var detection = r["labels"][0];
             callback(r.details.name || detection.name, detection.confidence, r.details.description || '', r.details.htmlContent || '');
            }
            else if(r.hasOwnProperty('image_objects') && r.image_objects !== null){
              var groups = group_boundind_box(r);
      
              groups.forEach(element => {
                  var x1 = element.vertices[0].x * frame.width;
                  var y1 = element.vertices[0].y * frame.height;
                  var x2 = element.vertices[2].x * frame.width;
                  var y2 = element.vertices[2].y * frame.height;
                  var cWidth = x2 - x1;
                  var cHeigh = y2 - y1;
                  var xcenter = x1 + (cWidth)/2;
                  var ycenter = y1 + (cHeigh)/2;
      
                  var xNew = xcenter * (widthUnity * 2) / frame.width - widthUnity;
                  var yNew = ycenter * (heightUnity * 2) / frame.height - heightUnity;
                  var widthNew = cWidth * (widthUnity * 2) / frame.width;
                  var heighNew = cHeigh * (heightUnity * 2) / frame.height;
            
                  var sceneEl = document.querySelector('a-scene');
                  var entityEl = document.createElement('a-plane');
                  
                  entityEl.setAttribute('width', widthNew);
                  entityEl.setAttribute('height', heighNew);
                  entityEl.setAttribute('depth', 0);
                  entityEl.setAttribute('color', '#FF8800');
                  entityEl.setAttribute('wireframe', true);
                  entityEl.setAttribute('position', {x: xNew, y: yNew, z: -2.0});
                  sceneEl.appendChild(entityEl);
      
                  var entityText = document.createElement('a-entity');
                  
                  entityText.setAttribute('text', {'value': element.labels});
                  entityText.setAttribute('position', {x: xNew, y: yNew, z: -2.0});
                  sceneEl.appendChild(entityText);
              });
              callback(r.details.name || detection.name, detection.confidence, r.details.description || '', r.details.htmlContent || '');
            }
            
        }
    };
    
    xhttp.open("POST", visionServiceEndpoint, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"image" : frame.dataUri.substr(23), "model_type" : modelType , "model_id" : modelId }));
    
}

function intersects(rect1, rect2){
  return !(rect1[2].x <  rect2[0].x  || rect1[0].x > rect2[2].x || rect1[2].y  <  rect1[0].y || rect1[0].y > rect2[2].y);
}

function group_boundind_box(res)
{
  var groups = []

  res.image_objects.forEach(image_object => {
    var flag = false;
    for (let index = 0; index < groups.length; index++) {
      const g = groups[index];
      if(intersects(image_object.bounding_polygon.normalized_vertices, g.vertices)){
        var flagName = true;
        groups[index].values.forEach(element => {
          if(element.name === image_object.name){
            flagName = false;
          }
        });
        if(flagName){
          flag = true;
          groups[index].values.push({'name' : image_object.name, 'confidence': image_object.confidence})
          groups[index].labels = groups[index].labels + ' | ' +  image_object.name + ' ' + two_decimal(image_object.confidence)
          break;
        }
      }
    }
    if(!flag){
      groups.push({'values' : [{'name' : image_object.name, 'confidence': image_object.confidence}], 'vertices' : image_object.bounding_polygon.normalized_vertices, 'labels': image_object.name + ' ' + two_decimal(image_object.confidence)})
    }
  });
  return groups;
}

function two_decimal(num){
  return (Math.round(num * 100) / 100).toFixed(2);
}
