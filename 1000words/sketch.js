
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

let senStart = ["this", "the", "your"];
let senVerb = ["is", "looks", "is truly", "is really"];
let senAdj = ["great", "super", "good", "very good","good","wow","WOW","cool","GREAT","magnificent", "magical","very cool","stylish","beautiful","so beautiful","so stylish","so professional","lovely","so lovely","very lovely","glorious","so glorious","very glorious","adorable","excellent","amazing"];


function setup() {
  createCanvas(400, 400);
  img = loadImage("holidays.jpg", onImageReady); // callback
}

function onImageReady() {
  classifier = ml5.imageClassifier('MobileNet', 'topk: 3', modelLoaded); // load classifier
  imageReady = true;
  charRNN = ml5.charRNN('./models/shakespeare/', modelTextLoaded);
  
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

  console.log("senStart.length " + Math.floor(Math.random()*senStart.length));

  input = senStart[Math.floor(Math.random()*senStart.length)] + " " + senAdj[Math.floor(Math.random()*senAdj.length)] + " " + labels[4].trim() + " " + senVerb[Math.floor(Math.random()*senVerb.length)];  // get the first label from the label array
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