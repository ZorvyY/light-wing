let V = require('./Vec.js');
let {StraightSegment, CurvedSegment} = require('./TrackSegment.js');
let S = StraightSegment;
let C = CurvedSegment;

let t1 = [];
t1.push(new S(V(200,100),V(500,100)));
t1.push(new S(V(200,200),V(500,200)));
t1.push(new C(V(500,200), 100, -Math.PI/2, Math.PI/2));
t1.push(new S(V(200,300),V(500,300)));
t1.push(new C(V(200,300), 100, Math.PI/2, -Math.PI/2));
t1.push(new S(V(200,400),V(500,400)));
let tracks = [];
tracks.push(t1);

module.exports = tracks;
