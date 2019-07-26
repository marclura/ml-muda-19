
let img;
let imageReady = false;
let modelReady = false;
let labelsReady = false;
let textReady = false;
let txt;
let input;
let sentences;

let classifier, charRNN;
let labels;


function setup() {
  createCanvas(400, 400);
  img = loadImage("holidays.jpg", onImageReady); // callback
}

function onImageReady() {
  classifier = ml5.imageClassifier('MobileNet', 'topk: 3', modelLoaded); // load classifier
  imageReady = true;
  charRNN = ml5.charRNN('./models/woolf/', modelTextLoaded);
  
}

function modelLoaded() {
  classifier.classify(img, onResult);
}

function onResult(error, result) {
  let labelstring = "";
  result.forEach(function(e) {    // getting all the results
    labelstring += (labelstring == "") ? e.label : ", " + e.label;    // combine them in a sting spearated by comma
  });
  labels = labelstring.split(", ");  // create the array
  console.log(labels);
  
  labelsReady = true;

  generateText();
}

function modelTextLoaded() {
  modelReady = true;
}

function generateText() {
  
  input = "the experience about " + labels[4];  // get the first label from the label array
  //input = "the meaning of life is";
  
  console.log(input);

  let data = {
    seed: input,
    temperature: 0.5,
    length: 400
  };
  
  charRNN.generate(data, gotData);
  
}

function gotData(err, result) {
    txt = input + " " + result.sample;
    console.log(txt);
    sentences = txt.split('.');
    textReady = true;
    select('#sentence').html(sentences[0] + ".");
}

function draw() {
  if (imageReady) {
    image(img, 0, 0, width, height/2);
  }
}