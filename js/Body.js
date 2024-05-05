let Limb = function(start, end){
    this.start = start;
    this.end = end;
    this.vec = computeVector(start, end);
}

class Body{
    limbs = {};
    constructor(bodyMidpoint, pose){

        let lowerBodyMidpoint = computeMidPoint(pose.leftHip, pose.rightHip);

        if(lowerBodyMidpoint === null && bodyMidpoint !== null){
            lowerBodyMidpoint = {
                "x": bodyMidpoint.x, 
                "y": height + 300
            }
        }

        this.limbs.body = new Limb(bodyMidpoint, lowerBodyMidpoint);

        this.limbs.leftArm = new Limb(bodyMidpoint, pose.leftElbow);
        this.limbs.rightArm = new Limb(bodyMidpoint, pose.rightElbow);

        this.limbs.leftForearm = new Limb(pose.leftElbow, pose.leftWrist);
        this.limbs.rightForearm = new Limb(pose.rightElbow, pose.rightWrist);

        this.limbs.leftThigh = new Limb(lowerBodyMidpoint, pose.leftKnee);
        this.limbs.rightThigh = new Limb(lowerBodyMidpoint, pose.rightKnee);

        this.limbs.leftLeg = new Limb(pose.leftKnee, pose.leftAnkle);
        this.limbs.rightLeg = new Limb(pose.rightKnee, pose.rightAnkle);

        this.head = {
            'x': pose.nose.x,
            'y': pose.nose.y,
            'diameter': Math.abs(pose.leftEar.x - pose.rightEar.x) * 1.2
        }        
    }

    draw(){
        for (let limb in this.limbs){
            drawLimb(this.limbs[limb]);
        };

        noStroke();             
        fill(255 * DRAW_CAMERA_INPUT);
        circle(this.head.x, this.head.y, this.head.diameter);
    }
};

/**
 * Retreive and parse poseNet skeletons into body object that consists of vectors.
 * @returns Parsed bodies list of Body class
 */

function getPosenetBodies() {

    let bodies = [];
    let midpoints = [];

    for(let pose of poses){
        let p = pose.pose;

        let midpoint = computeMidPoint(p.leftShoulder, p.rightShoulder);
        if(midpoint === null) continue;      

        if(isBodyDuplicate(midpoint, midpoints)) continue;

        bodies.push(new Body(midpoint, p))
        midpoints.push(midpoint);

    }

    return bodies;
}

/**
 * Compute vector from poseNET skeleton points
 * @param {vector} start beginning of the limb
 * @param {vector} end end of the limb
 * @returns vector of a limb.
 */

function computeVector(start, end){   
    return createVector(end.x-start.x, end.y - start.y);
}


function drawLimb(limb){
    
    stroke(255 * DRAW_CAMERA_INPUT);
    strokeWeight(40);
    line(limb.start.x, limb.start.y, limb.end.x, limb.end.y);
}

/**
 * Check if prediction is strong in the midpoin of body.
 * @param {*} a left shoulder 
 * @param {*} b right houlder
 * @returns True if prediction is above POSENET_CONFIDENCE_THRESHOLD
 */

function predictionConfidence(a, b){
    return (a.confidence > POSENET_CONFIDENCE_THRESHOLD && b.confidence > POSENET_CONFIDENCE_THRESHOLD);
}

/**
 * Check if this body is an duplicate.
 * @param {vector} midpoint Currently tested body's midpoint
 * @param {vector} arr Array of midpoints
 * @returns True if it's a duplicate. False otherwise.
 */

function isBodyDuplicate(midpoint, arr){
    for(mp of arr){
        if(dist(midpoint.x, midpoint.y, mp.x, mp.y) < BODY_DUPLICATE_TOLERANCE) return true;
    }
    return false;
}

/**
 * Generates the pose midpoint between shoulders which is important for parsed skeleton.
 * @param {vector} a left shoulder
 * @param {vector} b right shoulder
 * @returns Midpoint x and y coords.
 */

function computeMidPoint(a, b){

    if(!predictionConfidence(a,b)) return null;

    let midpointX = (a.x + b.x) / 2;
    let midpointY = (a.y + b.y) / 2;

    return {
        "x": midpointX, 
        "y": midpointY
    };

}