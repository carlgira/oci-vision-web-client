var labels = {};
var modelId = '';
var visionServiceEndpoint = '';

async function loadVariables() {
    const response = await fetch("js/variables.json");
    const variables = await response.json();
    console.log(variables);
    labels = variables['labels'];
    modelId = variables['modelId'];
    visionServiceEndpoint = variables['visionServiceEndpoint'];
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
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var detection = JSON.parse(this.responseText)["labels"][0];
            callback(labels[detection.name] || detection.name, detection.confidence);
        }
    };
    
    xhttp.open("POST", visionServiceEndpoint, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"image" : frame.dataUri.substr(23), "model_id" : modelId }));
}


loadVariables();