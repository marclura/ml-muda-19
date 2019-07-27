
let img;
let imageReady = false;
let modelReady = false;
let labelsReady = false;
let textReady = false;
let txt;
let input;
let sentences;
let pics;
let pic;
let currentLabel;
let colorH;   // to keep track of colors

let classifier, charRNN;
let labels;

// data management
let sentencesArray = [];  // all sentences

// images reader
let current = 0;    // current pic
let picsNo = 10;    // total amount of pictures in the folder
let allPicsDone = false;


// sentences parts
let senStart = ["this", "the", "your", "his", "her"];
let senVerb = ["is"];
let senAdj = ["great", "horrible", "good", "very good","good","cool","great","magnificent", "magical","very great","stylish","beautiful","so beautiful","so professional","lovely","so lovely","very lovely","glorious","so glorious","very glorious","adorable","excellent","amazing"];


function setup() {
  createCanvas(0, 0);
  Math.seedrandom(" " + Date.now()); // change the seed randomly for the Math.random() function
  //generateAboutDiary();
  readAllPics();
  colorH = Math.floor(Math.random()*360);
}

function generateAboutDiary() {   // generate quote

}

function readAllPics() {

  if(current < picsNo) {
    img = loadImage("pics/" + current + ".jpg", onImageReady); // callback
  } else {
    //addEvetListeners(); // to all the sentences to make with the pics interactive
    allPicsDone = true;
    current = 0;    // restart the counter
    readAllPics(); // restart with generation
  }

}

function onImageReady() {
  classifier = ml5.imageClassifier('MobileNet', 'topk: 3', modelLoaded); // load classifier
  imageReady = true;
  
  //document.getElementById('showimage').src = pic;
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

  // small initial sentence for the model to generate the full sentence
  currentLabel = labels[Math.floor(Math.random()*labels.length)]
  input = senStart[Math.floor(Math.random()*senStart.length)] + " " + senAdj[Math.floor(Math.random()*senAdj.length)] + " " + currentLabel + " " + senVerb[Math.floor(Math.random()*senVerb.length)];  // get the first label from the label array
  
  //input = "the meaning of life is";
  
  console.log(input);

  let data = {
    seed: input,
    temperature: 0.5,
    length: 300
  };
  
  // sentence generator
  charRNN.generate(data, gotData);
  
}

function gotData(err, result) {

    txt = input + " " + result.sample;    // combine the initial part of the sentence with the generated one
    
    sentences = txt.split('.');   // split the long string text into array of sentences that ends with the '.'
    textReady = true;


    /*
    // Version inline pictures
    let image = '<div class="images" style="background: url(\'pics\/' + current + '.jpg\') no-repeat center center"></div>';
    let changedLabel = image + '<span class="label">' + currentLabel + "</span>";
    let currSent = sentences[0];
    */

    let changedLabel = '<span class="label">' + currentLabel + "</span>";
    let currSent = sentences[0];



    currSent = currSent.replace(currentLabel, changedLabel);  // add class selector to only the label inside the sentence.

    // color generator: pick next a bit far from the previous to have good combination of them
    colorH += Math.floor(20+Math.random()*30);

    if(colorH > 360) colorH -= 360; // if bigger than 360 (out of range of HSL)

    console.log("colorH: " + colorH);

    let color = "hsl(" + colorH + ", 100%, 75%)";

    //currSent = '<span style="background: linear-gradient(' + color + ', ' + color + ')">' + currSent + ". </span>";
    currSent = '<span id="s' + current + '" style="background: ' + color  + '">' + currSent + ". </span>";

    // at the beginning add new sentenses to the array beacuse still not populated
    if(sentencesArray.length < current) {
      sentencesArray.push(currSent);
    } else {
      sentencesArray[current] = currSent;   // than change the phrases
    }

    console.log(currSent);

    pageUpdate();
    
}

function pageUpdate() {

  let finalHtml = "";

  sentencesArray.forEach(function(element) {
    finalHtml = finalHtml + element;
  });

  console.log(finalHtml);

  if(!allPicsDone) {
    let image = '<div id="' + current + '" class="images" style="background: url(\'pics\/' + current + '.jpg\') no-repeat center center"></div>';
    select('#gallery').html(select('#gallery').html() + image);   // get the current content of the #gallery div and add the next picture to it and set the html with updated content
  }
  select('#sentence').html(finalHtml.toLowerCase());

  current += 1;

  readAllPics();

}


function draw() {
  if (imageReady) {
    //image(img, 0, 0, width, height/2);
  }
}