let r, g, b;
let hspace, vspace;
let brain;
let which = "black";
let chooser;
let width, height;

function pickColour() {
  r = random(255);
  g = random(255);
  b = random(255);
  redraw();
}

function colourPredictor(r, g, b) {
  let inputs = [r / 255, g / 255, b / 255];
  let outputs = brain.predict(inputs);

  if (outputs[0] > outputs[1]) {
    return "black";
  } else {
    return "white";
  }
}

function trainColour(r, g, b) {
  if (r + g + b > 350) {
    return [1, 0];
  } else {
    return [0, 1];
  }
}

function setup() {
  noLoop();
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  hspace = width / 4;
  vspace = height / 6;
  chooser = new Chooser();

  brain = new NeuralNetwork(3, 3, 2);

  for (let i = 0; i < 10000; i++) {
    let r = random(255);
    let g = random(255);
    let b = random(255);
    let targets = trainColour(r, g, b);
    let inputs = [r / 255, g / 255, b / 255];
    brain.train(inputs, targets);
  }

  pickColour();
}

function draw() {
  background(r, g, b);

  // Central devision
  let divider = new Divider();

  textSize(64);
  noStroke();
  textAlign(CENTER);

  fill(0);
  text("black", width / 2 - hspace, height / 2);
  fill(255);
  text("white", width / 2 + hspace, height / 2);

  let which = colourPredictor(r, g, b);
  if (which === "black") {
    chooser.display(-hspace);
  } else {
    chooser.display(hspace);
  }
}

function mousePressed() {
  let targets = [];
  if (mouseX > width / 2) {
    // white side
    targets = [0, 1];
  } else {
    // black side
    targets = [1, 0];
  }

  let inputs = [r / 255, g / 255, b / 255];
  // Supervised learning
  // brain.train(inputs, targets);
  pickColour();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  width = windowWidth;
  height = windowHeight;

  console.log(width, height);
}

class Divider {
  constructor() {
    strokeWeight(1);
    stroke(255)
    line(width / 2, 0, width / 2, height);
    strokeWeight(2);
    stroke(0)
    line(width / 2 - 2, 0, width / 2 - 2, height);
    strokeWeight(2);
    stroke(0)
    line(width / 2 + 2, 0, width / 2 + 2, height);
  }
}

class Chooser {

  constructor() {
    this.inSize = 21;
    this.outSize = 34;

    this.x = width / 2;
    this.y = height / 2 - vspace;
  }

  display(offset) {
    fill(0);
    ellipse(this.x + offset, this.y, this.outSize);
    fill(255);
    ellipse(this.x + offset, this.y, this.inSize);
  }

}
