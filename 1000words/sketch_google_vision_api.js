let img;
let imageReady = false;

function setup() {
  createCanvas(400, 400);

  img = loadImage("pics/travel1.jpg", onImageReady); // callback
}

function onImageReady() {
  imageReady = true;

}

function blobToBase64(blob, cb) {
  var reader = new window.FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function() {
    cb(reader.result);
  }
}

function canvasToBase64(canvas, cb) {
  canvas.toBlob(function(blob) {
    blobToBase64(blob, cb);
  }, 'image/jpeg');
}



function draw() {
  background(0);

  if (imageReady) {
    image(img, 0, 0, width, height);
  }
}

function upload() {
  canvasToBase64(canvas, function(b64) {
    b64 = b64.replace('data:image/jpeg;base64,', '');
    request = {
      "requests": [
        {
          "image":{
            "content": b64
          },
          "features": [
            {
              "type": "LABEL_DETECTION",
              "maxResults": 5
            }
          ]
        }
      ]
    };
    
    $.ajax({
      
      method: 'POST',
      url: 'https://vision.googleapis.com/v1/images:annotate?key=<API-KEY>',
      contentType: 'application/json',
      data: JSON.stringify(request),
      processData: false,
      success: function(data) {
        output = data;
        var labels = data.responses[0].labelAnnotations[0];
        console.log('labels: ' + labels[0].description);
      },
      error: function (data, textStatus, errorThrown) {
        console.log('error: ' + data);
      }
    })
    
  })
}

function mousePressed() {
  upload();
}