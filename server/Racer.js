let Vec = require('./Vec.js');

const DRAG = 0.1;
const scale = 10;
const minWallBounce = 1;
const bounceDisplace = 2;

module.exports = class Racer {
  constructor(posX, posY) {

    if (posY === undefined) {
      //A vector was given
      this.pos = posX;
    } else {
      this.pos = new Vec(posX, posY);
    }
    
    this.boost = 1;
    this.dir = 1;
    this.vel = new Vec(0,0);
    this.thrust = Vec(1, this.dir, true);
    this.restart = 0;
  }
  
  bounce(n) {
    // n is the bounce normal
    let d = this.vel;
    if (d.dot(n) > 0) n = n.times(-1);
    this.vel = d.plus(n.times(-2 * d.dot(n)));
    this.vel = d.proj(n.rotate(Math.PI/2));
    this.pos = this.pos.plus(n.times(bounceDisplace));
    this.vel = this.vel.plus(n.times(minWallBounce));
    this.restart = 1;
  }

  draw(cx) {
    cx.beginPath();
    cx.strokeStyle = 'red';
    cx.moveTo(this.pos.x, this.pos.y);
    let {x, y} = this.pos.plus(this.thrust.times(-20));
    cx.lineTo(x,y);
    cx.stroke();
    cx.strokeStyle = 'black';
    //this.thrust = Vec(1, this.dir, true).times(this.boost);

    let dirVec = Vec(1, this.dir, true)
    let pivot = this.pos.plus(dirVec.times(-0.3*scale));
    let tip = dirVec.times(scale).plus(pivot);
    let tailLeft = dirVec.times(scale*0.64).rotate(2*Math.PI/3).plus(pivot);
    let tailRight = dirVec.times(scale*0.64).rotate(-2*Math.PI/3).plus(pivot);

    cx.beginPath();
    cx.moveTo(pivot.x, pivot.y);
    cx.lineTo(tailLeft.x, tailLeft.y);
    cx.lineTo(tip.x, tip.y);
    cx.lineTo(tailRight.x, tailRight.y);
    cx.closePath();
    cx.fill();

  }

  get speed() {
    return this.vel.magnitude;
  }

  get position() {
    return this.pos;
  }

  setBoost(length){
    length -= 5;
    length = Math.max(length, 0);
    this.boost = 2 - (length / 20 * 2) + 1;
  }

  step() { //perhaps have a time construct here
    const time = 1/20;
    this.thrust = Vec(1, this.dir, true).times(this.boost);
    if (this.restart != 0) {
      this.thrust = this.thrust.times(0);
      this.restart = Math.max(this.restart - time, 0);
    }
    this.boost = 1;
    let acc = new Vec(0,0);
    acc = acc.plus(this.thrust);
    acc = acc.plus(this.vel.times(-DRAG*this.speed));
    this.vel = this.vel.plus(acc.times(time));
    this.pos = this.pos.plus(this.vel);
  }

  nudgeAngle(angle) {
    this.dir -= angle;
  }

}
