import Vec from './Vec.js';
import Racer from './Racer.js';
import KeyState from './KeyState.js';
import { StraightSegment, CurvedSegment } from './TrackSegment.js';
import RaceManager from './RaceManager.js';
import Tracks from './Tracks.js';
import * as socket from './socket.js';

let canvas = document.getElementById('canvas');
canvas.width = 750;
let cx = canvas.getContext('2d');

let keyState = new KeyState();
let racer = new Racer(100,120);
console.log('this racer:', racer);

let otherUsers = [];
socket.initConnection(otherUsers, racer);
socket.receiveNewRacer(otherUsers);
socket.updateRacerPositions(otherUsers);


let course = Tracks[0];
let raceManager = new RaceManager([racer], course);

function update() {
  canvas.height = canvas.height;
  course.forEach(piece => piece.draw(cx));
  
  if (keyState.left) racer.nudgeAngle(Math.PI / 60);
  if (keyState.right) racer.nudgeAngle(-Math.PI / 60);

  raceManager.step();

  racer.draw(cx);
  otherUsers.forEach(user => {
    let otherRacer = user.racer;
    try {
      otherRacer.draw(cx);
    } catch (e) {
      console.log(user);
      throw(e);
    }
  });

  socket.sendNewPosition(racer);
};

(function animloop() {
  requestAnimationFrame(animloop);
  update();
})();

/* TEST CODE
class MouseState {
  constructor(canv) {
    canv.addEventListener('mousemove', e => {
      this.x = e.offsetX;
      this.y = e.offsetY;
    });
  }
}

canvas.addEventListener('mousedown', e => {
  racer.pos = Vec(e.offsetX, e.offsetY);
});
*/

/*
function update() {
  canvas.height = canvas.height;
  course.forEach(piece => piece.draw(cx));
  
  if (keyState.left) racer.nudgeAngle(Math.PI / 60);
  if (keyState.right) racer.nudgeAngle(-Math.PI / 60);
  if (keyState.up) racer.pos = racer.pos.plus(Vec(0,-1));
  if (keyState.down) racer.pos = racer.pos.plus(Vec(0,1));

  raceManager.step();

  racer.draw(cx);
};
*/
