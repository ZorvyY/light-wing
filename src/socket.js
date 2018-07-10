//TODO: In the future, I can try creating an object, otherPlayer state,
//that updates the other players using sockets just as mousestate 
//encapsulates the behaviour of the mouse

/* Defining the io management interface the game uses:
 * Core functionality:
 *  - Send user racer position to server
 *  - Receive position of other racers
 *  - Get a username and connect
 *  initConnection(otherRacers);
 *  updateRacerPositions(otherRacers);
 *  sendNewPosition(otherRacers);
 */
let io = require('socket.io-client');
import Racer from './Racer.js';

let socket;
let username;

export function pingCheck() {
  let start = Date.now();
  socket.emit('ping'); 
  
  return new Promise((res, rej) => {
    socket.on('pong', () => {
      let elapsedTime = Date.now() - start;
      console.log('ping: ' + elapsedTime + 'ms');
      res(elapsedTime);
    });
  });
}


export function initConnection(otherRacers, racer) {
  username = prompt('what is your name?');
  socket = io();

  socket.on('welcome', otherPlayerArray => {
    // Data should consist of an array of users
    console.log(otherPlayerArray);
    console.log(JSON.parse(JSON.stringify(otherPlayerArray)));
    otherPlayerArray.forEach(user => {
      user.racer = deepAssign(new Racer(0,0), user.racer);
      otherRacers.push(user);
    });

    console.log(otherRacers);

    // Configure response
    socket.emit(
      'gotit', JSON.stringify(
      {
        id: socket.id, 
        username: username,
        racer: racer
      })
    );
  });
}

export function sendNewPosition(racer) {
  socket.emit(
    'racer-update', 
    {
      id: socket.id, 
      username: username,
      racer: racer
    }
  ); 
}

//Called once, it acts as a listener and updates the array automatically.
export function updateRacerPositions(otherRacers) {
  socket.on('racer-update', user => {
    let targetUser = otherRacers.find(element => {
      return element.id == user.id;
    });
    deepAssign(targetUser.racer, user.racer);
  });
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

//Similar to the above, it handles the otherRacers array and updates automatically.
export function receiveNewRacer(otherRacers) {
  socket.on('player-join', user => {
    console.log('new player');
    user = JSON.parse(user);
    console.log(user);
    user.racer = deepAssign(new Racer(0, 0), user.racer);
    otherRacers.push(user);
  });
}
