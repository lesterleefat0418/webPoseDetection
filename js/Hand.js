class Hand{
    constructor(forearm, whichHand){
        this.wrist = createVector(forearm.end.x, forearm.end.y);
        
        this.pos = forearm.vec.copy();
        this.pos.normalize();
        this.pos.setMag(HAND_BOUNDING_DIAMETER / 2);
        this.pos.add(this.wrist);

        if(whichHand == 'left') this.hand = true;
        else if(whichHand == 'right') this.hand = false;
    }

    checkCollision(ball){
        return dist(this.pos.x, this.pos.y, ball.pos.x, ball.pos.y) <= HAND_BOUNDING_DIAMETER
    }

    /**
     * Check bounces if they are correct. Otherwise reset the score and target hand.
     * @param {vector} targetHand hand which should bounce the ball to follow the order.
     * @returns newTarget: new hand targed, set to null if we lost the correct order.
     * addScore: should I add score or reset?
     */

    countHandBounce(targetHand){

        let newTarget;
        let addScore;

        if(targetHand === null){
            addScore = true;
            newTarget = this.hand;
        }
        else if(this.hand === targetHand){
            addScore = false;
            newTarget = null;
        }
        else if(this.hand !== targetHand){
            addScore = true;
            newTarget = !targetHand;
        }

        return [newTarget, addScore];
    }

    draw(){
        noFill();
        strokeWeight(4);
        stroke(0,255,0);
        circle(this.pos.x, this.pos.y, HAND_BOUNDING_DIAMETER);
    }

}