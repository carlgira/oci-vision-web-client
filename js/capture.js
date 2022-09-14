var labels = {};
var modelId = '';
var visionServiceEndpoint = '';
var widthUnity = 1;
var heightUnity = 0.45;
var pixel = 0.001;

async function loadVariables() {
    const response = await fetch("js/variables.json");
    const variables = await response.json();    
    modelId = variables['modelId'];
    visionServiceEndpoint = "https://" + variables['endpoint'] + "/" + variables['path'];

    variables['labels'].split(",").forEach(label => {
        var values = label.split(":");
        labels[values[0]] = values[1];
    });
}

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
    /*
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var detection = JSON.parse(this.responseText)["labels"][0];
            callback(labels[detection.name] || detection.name, detection.confidence);
        }
    };
    
    xhttp.open("POST", visionServiceEndpoint, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"image" : frame.dataUri.substr(23), "model_id" : modelId }));
    */

    var object_detection = {
        "errors": [],
        "image_classification_model_version": null,
        "image_objects": [
          {
            "bounding_polygon": {
              "normalized_vertices": [
                {
                  "x": 0.32233796296296297,
                  "y": 0.17664930555555555
                },
                {
                  "x": 0.6510416666666666,
                  "y": 0.17664930555555555
                },
                {
                  "x": 0.6510416666666666,
                  "y": 0.7738715277777778
                },
                {
                  "x": 0.32233796296296297,
                  "y": 0.7738715277777778
                }
              ]
            },
            "confidence": 0.678956,
            "name": "Meneifi"
          }
        ],
        "image_text": null,
        "labels": null,
        "object_detection_model_version": "ocid1.aivisionmodel.oc1.eu-frankfurt-1.amaaaaaaqtij3maagcrlzwtdp56ww7nnkrcsxrfylyd5deln3xmwozjra3ma",
        "ontology_classes": [
          {
            "name": "Meneifi",
            "parent_names": [],
            "synonym_names": []
          }
        ],
        "text_detection_model_version": null
      };

      var image_classification = {
        "errors": [],
        "image_classification_model_version": "version",
        "image_objects": null,
        "image_text": null,
        "labels": [
          {
            "confidence": 0.88311523,
            "name": "Pakistan_Monument_Islamabad"
          },
          {
            "confidence": 0.64410686,
            "name": "Lotus_Temple"
          },
          {
            "confidence": 0.61351985,
            "name": "Nyhavn"
          },
          {
            "confidence": 0.58069396,
            "name": "Kazan_Kremlin"
          },
          {
            "confidence": 0.57562697,
            "name": "Tower_Bridge"
          }
        ],
        "object_detection_model_version": null,
        "ontology_classes": [
          {
            "name": "Pakistan_Monument_Islamabad",
            "parent_names": [],
            "synonym_names": []
          },
          {
            "name": "Lotus_Temple",
            "parent_names": [],
            "synonym_names": []
          },
          {
            "name": "Tower_Bridge",
            "parent_names": [],
            "synonym_names": []
          },
          {
            "name": "Kazan_Kremlin",
            "parent_names": [],
            "synonym_names": []
          },
          {
            "name": "Nyhavn",
            "parent_names": [],
            "synonym_names": []
          }
        ],
        "text_detection_model_version": null
      };

      var oo = {
        "image_objects": [
          {
            "name": "Ajwa",
            "confidence": 0.4038895,
            "bounding_polygon": {
              "normalized_vertices": [
                {
                  "x": 0.04555555555555556,
                  "y": 0.205
                },
                {
                  "x": 0.45666666666666667,
                  "y": 0.205
                },
                {
                  "x": 0.45666666666666667,
                  "y": 0.7016666666666667
                },
                {
                  "x": 0.04555555555555556,
                  "y": 0.7016666666666667
                }
              ]
            }
          },
          {
            "name": "Ajwa",
            "confidence": 0.36063078,
            "bounding_polygon": {
              "normalized_vertices": [
                {
                  "x": 0.42777777777777776,
                  "y": 0.09166666666666666
                },
                {
                  "x": 0.8088888888888889,
                  "y": 0.09166666666666666
                },
                {
                  "x": 0.8088888888888889,
                  "y": 0.5483333333333333
                },
                {
                  "x": 0.42777777777777776,
                  "y": 0.5483333333333333
                }
              ]
            }
          },
          {
            "name": "Ajwa",
            "confidence": 0.35441956,
            "bounding_polygon": {
              "normalized_vertices": [
                {
                  "x": 0.47333333333333333,
                  "y": 0.465
                },
                {
                  "x": 0.9388888888888889,
                  "y": 0.465
                },
                {
                  "x": 0.9388888888888889,
                  "y": 1
                },
                {
                  "x": 0.47333333333333333,
                  "y": 1
                }
              ]
            }
          }
        ],
        "labels": null,
        "ontologyClasses": [
          {
            "name": "Ajwa",
            "parentNames": [],
            "synonymNames": []
          }
        ],
        "imageText": null,
        "imageClassificationModelVersion": null,
        "objectDetectionModelVersion": "ocid1.aivisionmodel.oc1.eu-frankfurt-1.amaaaaaaqtij3maagcrlzwtdp56ww7nnkrcsxrfylyd5deln3xmwozjra3ma",
        "textDetectionModelVersion": null,
        "errors": []
      };

      var r = oo;

      console.log(r.hasOwnProperty('image_objects'));
      console.log(r.image_objects !== null);

      if(r.hasOwnProperty('image_objects') && r.image_objects !== null){
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

            console.log(xNew + ' ' + yNew + ' ' + widthNew + ' '  + heighNew);


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

      }
      else if(r.hasOwnProperty('labels') && r.labels !== null) {
        var detection = r["labels"][0];
       callback(labels[detection.name] || detection.name, detection.confidence);
      }
}

function intersects(rect1, rect2){
  return !(rect1[2].x <  rect2[0].x  || rect1[0].x > rect2[2].x || rect1[2].y  <  rect1[0].y || rect1[0].y > rect2[2].y);
}

function group_boundind_box(res)
{
  var groups = []

  res.image_objects.forEach(image_object => {
    console.log(image_object);
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

loadVariables();