const path = require('path');
const express = require('express');
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let Vec = require('./Vec.js');
let Racer = require('./Racer.js');
let Segments = require('./TrackSegment.js');
let RaceManager = require('./RaceManager.js');
let Tracks = require('./Tracks.js');

app.use(express.static(path.resolve(__dirname, '..', 'dist')));

console.log(path.resolve(__dirname, '..', 'dist'));

let users = [];
//just holds names currently.

function Game(players) {
  let racers = players.map(player => {
    let racer = new Racer(Vec(100,100 + 50*Math.random()|0));
    player.racer = racer;
    return racer;
  });
  let course = Tracks[(Math.floor(Tracks.length*Math.random()))];
  let raceManager = new RaceManager(racers, course);

  //internal game update
  function update() {
    raceManager.step();
    players.forEach(player => {
      if (player.keyState) {
        if (player.keyState.left) player.racer.nudgeAngle(Math.PI / 60);
        if (player.keyState.right) player.racer.nudgeAngle(-Math.PI / 60);
      }
    });
    // Send the positions of the players.
    /*
    players.forEach(player => {
      player.socket.emit('game-update', racers);
    });
    */
    io.emit('game-update', racers);
  }

  io.emit('new-game', course);
  setInterval(update, 1000/60);
}

io.on('connection', function(socket){
  let user;
  socket.emit('welcome', users);
  console.log('a user connected', socket.id);

  socket.on('gotit', newUser => {
    user = newUser;
    users.push(user);
    if (users.length == 2) Game(users);
  });

  socket.on('key-update', keyState => {
    if (user) {
      user.keyState = keyState;
    }
  });

  socket.on('disconnect', () => {
    users.splice(users.indexOf(user), 1);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
