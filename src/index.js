import Vec from './Vec.js';
import Racer from './Racer.js';
import KeyState from './KeyState.js';
import { StraightSegment, CurvedSegment } from './TrackSegment.js';
//import RaceManager from './RaceManager.js';
//import Tracks from './Tracks.js';
import Socket from './Socket.js';

let canvas = document.getElementById('canvas');
canvas.width = 750;
let cx = canvas.getContext('2d');

let keyState = new KeyState();
let username = prompt('What is your name?');
let connection = new Socket(username);


function startGame(track) {
  connection.onStateChange(wings => {
    let racers = processRacers(wings);

    requestAnimationFrame(() => {
      canvas.height = canvas.height;

      track.forEach(piece => piece.draw(cx));

      racers.forEach(racer => {
        racer.draw(cx);
      });
    });

  });
  
  setInterval(() => {connection.emitKeyUpdate(keyState)}, 1000/60);
}

//Preserve prototypes of vectors in racer class
function deepAssign(obj, data) {
  Object.keys(obj).forEach(function(key,index) {
    if (obj[key] instanceof Object) {
      deepAssign(obj[key], data[key]);
      data[key] = obj[key];
      //This is inefficient as hell
    }
  });

  Object.assign(obj, data);
  return obj;
}

function processCourse(course) {
  return course.map(seg => {
    if (seg.isStraight)
      seg = deepAssign(new StraightSegment(), seg);
    else if (seg.isCurved)
      seg = deepAssign(new CurvedSegment(), seg);
    else console.log('Tracksegment format unexpected');

    //console.log("Seg:::", seg);
    return seg;
  });
  //return course;
}

function processRacers(racers) {
  return racers.map(racer => {
    return deepAssign(new Racer(Vec(0,0)), racer);
  });
  //return racers;
}

connection.onNewGame(course => {
  let track = processCourse(course);
  //console.log(track);
  startGame(track);
});
