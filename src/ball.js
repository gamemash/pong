let {Map} = require('Immutable');
let Vector = require('./vector.js');

module.exports = {
  create: function(){ 
    return Map({
      name: "Ball",
      properties: Map({
        position: Vector.create(48,32),
        velocity: Vector.create(1, 1),
        size: Vector.create(1,1),
        speed: 10
      })
    });
  },
  update: function(ball, dt){
    return ball.setIn(['properties','position'], Vector.addScaledVector(ball.getIn(['properties','position']), ball.getIn(['properties','velocity']), dt * ball.getIn(['properties','speed'])));
  }
}
