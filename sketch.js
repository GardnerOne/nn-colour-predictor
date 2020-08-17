let h, s, b;
let hspace, vspace;
let brain;
let which = "black";
let chooser;
let width, height;

function pickColour() {
  h = random(255);
  s = random(255);
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

  brain = new NeuralNetwork(3, 10, 2);

  for (let i = 0; i < 10000; i++) {
    let r = random(255);
    let g = random(255);
    let b = random(255);
    let targets = trainColour(r, g, b); // Not meaningful
    let inputs = [r / 255, g / 255, b / 255];
    brain.train(inputs, targets);
  }

  pickColour();
}

function draw() {
  colorMode(HSB, 100);
  background(h, s, b);

  // Central devision
  let divider = new Divider();

  textSize(64);
  noStroke();
  textAlign(CENTER);


  fill(0);
  stroke(255);
  text("black", width / 2 - hspace, height / 2);
  fill(255);
  stroke(0);
  text("white", width / 2 + hspace, height / 2);
  noStroke();

  let ans = 'black';
  if (b >= 127.5) {
    ans = 'white';
  }
  text(ans, width / 2, 100);

  let which = colourPredictor(h, s, b);
  if (which === "black") {
    chooser.display(-hspace);
  } else {
    chooser.display(hspace);
  }
}

function keyPressed() {
  let targets = [];
  if (keyCode === LEFT_ARROW) {
    // white side
    targets = [0, 1];
  }
  else if (keyCode === RIGHT_ARROW) {
    // black side
    targets = [1, 0];
  }
  if (targets !== []) {
    learn(targets);
  }
}

function learn(targets) {
  let inputs = [h / 255, s / 255, b / 255];
  // Supervised learning
  brain.train(inputs, targets);
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
    stroke(255);
    line(width / 2, 0, width / 2, height);
    strokeWeight(2);
    stroke(0);
    line(width / 2 - 2, 0, width / 2 - 2, height);
    strokeWeight(2);
    stroke(0);
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
