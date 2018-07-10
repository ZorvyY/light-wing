const path = require('path');
const express = require('express');
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static(path.resolve(__dirname, '..', 'dist')));

console.log(path.resolve(__dirname, '..', 'dist'));

var uniqueId = function() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};

let users = [];
// This is an array of in-game racers, along with a username, id.


io.on('connection', function(socket){
  socket.emit('welcome', users);
  console.log('a user connected', socket.id);

  socket.on('gotit', user => {
    users.push(JSON.parse(user));
    socket.broadcast.emit('player-join', user);
  });

  // this setTimeout makes it so updates aren't sent before the 
  // object is added to the users array.
  // Note: this is treating a symptom, not the problem because the 
  // updates are still received, they are just not being acted upon.
  setTimeout(() => {
  socket.on('racer-update', user => {
    let targetUser = users.find(element => {
      return element.id == user.id;
    });
    if (targetUser === undefined) {
      console.log("ERROR: Updating undefined user");
    }
    targetUser = user;
    
    socket.broadcast.emit('racer-update', user);
  });
  }, 100);
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
