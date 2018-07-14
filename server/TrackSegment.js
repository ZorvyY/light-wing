let Vec = require('./Vec.js');

class TrackSegment {

  draw(cx) {
    throw new Error('Must be called on non-abstract class');
  }

  //segment is an array of two Vectors (points)
  intersects(segment) {
    throw new Error('Must be called on non-abstract class');
  }

}

class StraightSegment /*extends TrackSegment*/ {
  constructor(vec1, vec2) {
    //super();
    this.p1 = vec1;
    this.p2 = vec2;
    this.isStraight = true;
  }

  draw(cx) {
    cx.beginPath();
    let {x, y} = this.p1;
    cx.moveTo(x,y);
    ({x, y} = this.p2);
    cx.lineTo(x,y);
    cx.stroke();
  }

  intersects(point) {
    let triangleDist = this.p1.minus(point).magnitude + this.p2.minus(point).magnitude - this.p1.minus(this.p2).magnitude;
    let base = this.p2.minus(this.p1)
    let lineDist = Math.abs(point.minus(this.p1).cross(base)/base.magnitude);
    if (triangleDist < 1 && lineDist < 1) return this.p1.minus(this.p2).rotate(Math.PI/2).normalize();
  }

  intersectsLine(segment) {
    let p = this.p1;
    let p2 = this.p2;
    let q = segment[0];
    let q2 = segment[1];

    let r = p2.minus(p);
    let s = q2.minus(q);

    let uNumerator = q.minus(p).cross(r);
    let denominator = r.cross(s);
    
    let u = uNumerator / denominator;
    let t = q.minus(p).cross(s) / denominator;

    
    if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
      return p.plus(r.times(t));
    } else return false;
  }
}

class CurvedSegment /*extends TrackSegment*/ {
  constructor(centre, radius, startAngle, endAngle) {
    this.centre = centre;
    this.radius = radius;
    this.a1 = startAngle;
    this.a2 = endAngle;
    this.isCurved = true;
  }

  draw(cx) {
    cx.beginPath();
    cx.arc(this.centre.x, this.centre.y, this.radius, this.a1, this.a2);
    cx.stroke();
  }
  
  intersects(point) {
    let normal = point.minus(this.centre);
    let distance = normal.magnitude - this.radius;
    normal = normal.normalize();
    let startAngle = Math.min(this.a1, this.a2);
    let endAngle = Math.max(this.a1, this.a2);
    let nAngle = normal.angle;

    if (this.a1 <= this.a2) {
      if (Math.abs(distance) < 1 && startAngle < nAngle && nAngle < endAngle) return normal.normalize();
      else return false;
    } else {
      if (Math.abs(distance) < 1 && !(startAngle < nAngle && nAngle < endAngle)) return normal.normalize();
      else return false;
    }
  }

  intersectsLine(segment) {
    let d = segment[1].minus(segment[0]);
    let f = segment[0].minus(this.centre);

    let a = d.dot(d);
    let b = 2*f.dot(d);
    let c = f.dot(f) - this.radius*this.radius;
    let D = b*b-4*a*c;
    if (D < 0) return false;
    D = Math.sqrt(D);

    let t1 = (-b - D)/(2*a);
    let t2 = (-b + D)/(2*a);

    if ( (0 <= t1 && t1 <= 1) && (0 <= t2 && t2 <= 1) ) 
      console.log('Something weird happened. line 107 in tracksegment');
    
    if (0 <= t1 && t1 <= 1) {
      let point = d.times(t1).plus(segment[0]);
      if (this.intersects(point) !== false) {
        console.log('yay!');
        return point;
      }
    }

    if (0 <= t2 && t2 <= 1) {
      let point = d.times(t2).plus(segment[0]);
      if (this.intersects(point) !== false) {
        return point;
      }
    }
    
    return false;
  }
}

module.exports = {
  CurvedSegment: CurvedSegment,
  StraightSegment: StraightSegment
};

