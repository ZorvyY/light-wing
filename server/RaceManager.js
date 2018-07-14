//The race manager class, containing logic for 
//"stepping" the internal state of the race 
//when given a course object and an array of racers
module.exports = class RaceManager {
  constructor(racers, course) {
  // course is currently an array of tracksegments
  // racers is currently an array of racers
    this.course = course;
    this.racers = racers;
  }

  step() {
    for (let i = 0; i < this.racers.length; i++) {
      let racer = this.racers[i];
      racer.step();
      for (let j = 0; j < this.course.length; j++) {
        let segment = this.course[j];
        let normal = segment.intersects(racer.pos);
        if (normal) {
          racer.bounce(normal);
        } else {
          //Find the length of the intersection of the segment behind the racer, 
          //and calculate extra thrust based on that
          let wallIntersect = segment.intersectsLine([
            racer.pos, 
            racer.thrust.normalize().times(-25).plus(racer.pos)
          ]);
          /*
          let cx = document.querySelector('#canvas').getContext('2d');
          cx.beginPath();
          cx.moveTo(racer.pos.x, racer.pos.y);
          let {x, y} = 
            racer.thrust.normalize().times(-25).plus(racer.pos);
          cx.lineTo(x,y);
          cx.stroke();
          */

          if (wallIntersect !== false) {
            /*
            console.log(wallIntersect, racer.pos.plus(racer.thrust.normalize().times(-25).plus(racer.pos)).times(0.5));
            cx.beginPath();
            cx.arc(wallIntersect.x, wallIntersect.y, 2, 0, 2*Math.PI);
            cx.fill();
            */
            let magnitude = wallIntersect.minus(racer.pos).magnitude;
            if (racer.boost != 1) console.log('The boost is not currently 1, setting boost anyway');
            racer.setBoost(magnitude);
          }
        }
      }
    }

  }



}
