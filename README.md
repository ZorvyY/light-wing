# light-wing
It's a io style racing game.

Inspired by one of my favourite android games, [_Data Wing_](https://play.google.com/store/apps/details?id=com.DanVogt.DATAWING&hl=en_CA), I've decided to add a live multiplayer feature. Using socket.io, you can have multiple players racing on the same track, and each is updated as to the position of the other players (In this way, it's kind of like a .io game, eg. agar.io, slither.io, etc). 

To check it out yourself, simply

~~~~
git clone https://github.com/ZorvyY/light-wing.git
cd light-wing
npm install
node server/server.js
~~~~

Note that in the current state, you have to have exactly 2 tabs open and connected. If the screen begins to flicker between different positions, restart the server and the two tabs should reconnect automatically.

There is no win condition in the current game, but you can control the ships with the left and right arrows keys and get a feel for the game physics.

Enjoy.
