const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const DRAW_SKELETON = false;
const DRAW_CAMERA_INPUT = true;

const POSENET_CONFIDENCE_THRESHOLD = 0.5;
const HAND_BOUNDING_DIAMETER = 100;
const BODY_DUPLICATE_TOLERANCE = 200;
const ERROR_COUNTER_LIMIT = 200;

let initialized = false;

let video;
let poseNet;

let poses = [];
let bodies = [];
let ball;

let whichHand = null;
let stillInLeftHand = false;
let stillInRightHand = false;
let score = 0;

let errorCounter = 0;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    try{
        video = createCapture(VIDEO, ()=>{ initialized = true;});
        video.size(width, height);
        video.hide();
    }
    catch(error){
        console.error(error);
    }
    
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', function(results) {
        poses = results;
    });

    ball = new Ball(width / 2, 0);
}

function modelReady() {
    console.log('Model Loaded!');
}

function draw() {

    if(!initialized) {
        stroke(0)
        strokeWeight(10);
        rect(0,0,width,height);
        noStroke();
        textAlign(CENTER);
        textSize(48);
        text("Waiting for camera...", width/2, height/2 + 24);
        return;
    }

    background(255);
    
    push()
    translate(width, 0);
    scale(-1, 1);

    if(DRAW_CAMERA_INPUT) image(video, 0, 0, width, height);
    
    let newBodies = getPosenetBodies();
    
    if(newBodies.length == 0){
        errorCounter++;
    }
    else{
        bodies = newBodies;
        errorCounter = 0;
    }

    //Prevent the random disappearance of body between frames.
    if(errorCounter < ERROR_COUNTER_LIMIT){

        for(const body of bodies){

            if(DRAW_SKELETON){
                body.draw();
            }

            let leftHand = new Hand(body.limbs.leftForearm, 'left');
            let rightHand = new Hand(body.limbs.rightForearm, 'right');

            leftHand.draw();
            rightHand.draw();

            if(leftHand.checkCollision(ball)){

                if(!stillInLeftHand){

                    ball.bounce(leftHand.pos);
                    [whichHand, addScore] = leftHand.countHandBounce(whichHand);

                    if(addScore) score++;
                    else score = 0;
                }

                stillInLeftHand = true;
            }
            else{
                stillInLeftHand = false;
            }

            if(rightHand.checkCollision(ball)){

                if(!stillInRightHand){

                    ball.bounce(rightHand.pos);
                    [whichHand, addScore] = rightHand.countHandBounce(whichHand);

                    if(addScore) score++;
                    else score = 0;
                }

                stillInRightHand = true;
            }
            else{
                stillInRightHand = false;
            }
        }
    }
           
    ball.move();
    ball.draw();

    if(ball.pos.x <0 || ball.pos.x > width) {
        ball.dir.x = -ball.dir.x;
        ball.dir.rotate(-radians(Math.random()*30))
    }

    if(ball.pos.y > height) {
        ball = new Ball(width / 2,0);
        score = 0;
        whichHand = null;
    }

    pop();

    noStroke();
    fill(255 * DRAW_CAMERA_INPUT);
    textSize(48);
    textAlign(LEFT)
    text(score, 30, 30+36);
}