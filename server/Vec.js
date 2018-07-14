class Vec {
  constructor(x, y, isPolar) {
    if (!(this instanceof Vec)) {
      return new Vec(...arguments);
    }
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
      return;
    }
    if (isPolar) {
      // x = magnitude, y = angle
      this.x = x * Math.cos(y);
      this.y = x * Math.sin(y);
      return;
    }
    this.x = x;
    this.y = y;
  }

  toPolar() {
    return {
      magnitude: Math.hypot(this.x, this.y),
      angle: Math.atan2(this.y, this.x)
    };
  }

  get magnitude() {
    return this.toPolar().magnitude;
  }

  get angle() {
    return this.toPolar().angle;
  }
  
  get degrees() {
    return this.angle / Math.PI * 180;
  }

  //TODO: Rewrite this so it's not its own method... 
  //It should be part of the constructor.
  /*
  static fromPolar(mag, angle) {
    return new Vec(
      mag * Math.cos(angle),
      mag * Math.sin(angle)
    );
  }
  */

  normalize() {
    return this.times(1/this.magnitude);
  }

  plus(v) {
    return new Vec(
      this.x + v.x,
      this.y + v.y
    );
  }

  minus(v) {
    return new Vec(
      this.x - v.x,
      this.y - v.y
    );
  }

  times(scalar) {
    return new Vec(
      this.x * scalar,
      this.y * scalar
    );
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  rotateAround(a, point) {
    let {magnitude, angle} = this.minus(point).toPolar();
    angle += a;
    return (new Vec(magnitude, angle, true)).plus(point);
  }

  rotate(a) {
    if (Math.abs(a) > 2 * Math.PI) console.log('Check to see if your rotations are in radians');
    let {magnitude, angle} = this.toPolar();
    angle += a;
    return new Vec(magnitude, angle, true);
  }

  proj(v) {
    let vhat = v.normalize();
    return vhat.times(this.dot(vhat));
  }
}

let _old = Vec;
Vec = function(...args) { return new _old(...args); };
module.exports = Vec;
