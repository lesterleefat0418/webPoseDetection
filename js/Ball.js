class Ball{
    constructor(x, y){
        this.pos = createVector(x,y);
        this.dir = createVector(0, 1);
        this.gravity = createVector(0, 0.1);
    }

    /**
     * Move the ball with respect to it's direction and gravity force.
     */

    move(){
        this.pos.add(this.dir);
        this.dir.add(this.gravity);
    }

    /**
     * Bounce the ball from hand with respect to collision vector.
     * @param {vector} handVec 
     */

    bounce(handVec){
        let collisionVec = this.pos.copy().sub(handVec);
        collisionVec.normalize();
        collisionVec.mult(5);
        this.dir = collisionVec;
    }

    draw(){
        strokeWeight(40);
        stroke(255,0,0);
        point(this.pos.x, this.pos.y);
    }
}