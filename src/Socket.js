//TODO: In the future, I can try creating an object, otherPlayer state,
//that updates the other players using sockets just as mousestate 
//encapsulates the behaviour of the mouse

/* Defining the io management interface the game uses:
 * Core functionality:
 *  - initConnection: initializes socket and sends username to server
 *  - sendKeyState: The main way the code updates the position of the
 *    player for the server to act upon.
 *  - receiveNewPlayers: How the client receives the updated positions 
 *    of each player on the screen.
 */
import io from 'socket.io-client';
//import Racer from './Racer.js';


export default class Socket {
  constructor(name) {
    this.socket = io();
    this.name = name;
    this.onWelcome({name: name});
  }

  onWelcome(userObj) {
    this.socket.on('welcome', users => {
      if (userObj.name == undefined) {
        console.log('No name given: ' + userObj.name);
        userObj.name = 'Unnamed user ' + users.length;
      }
      this.socket.emit('gotit', userObj);
    });
  }

  onStateChange(cb) {
    this.socket.on('game-update', racers => cb(racers));
  }

  onNewGame(cb) {
    this.socket.on('new-game', course => cb(course));
  }

  emitKeyUpdate(keyState) {
    this.socket.emit('key-update', keyState);
  }

}


/*
let socket = {};
let username = '';

class Socket {
  constructor(name) {
    this.socket = socket;
    this.username = name;
    initConnection(name);
  }
  
  pingCheck() {
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

  onNewGame(cb) {
    socket.on('new-game', course) {
      cb(course);

    }
  }


  initConnection() {
    username = prompt('what is your name?');
    socket = io();

    socket.on('welcome', otherPlayerArray => {
      socket.emit('gotit', {username: username});
    });
  }

  sendKeyState(keyState) {
    socket.emit('key-update', keyState); 
  }

  //Called once, it acts as a listener and updates the array automatically.
  updateRacerPositions(racerArray) {
    socket.on('game-update', racers => {
      racerArray = racers;
      racerArray.forEach(racer => {
        racer = deepAssign(Vec(0,0), racer);
      });
    });
  }
}
*/

