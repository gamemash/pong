let {Map} = require('Immutable');
let Vector = require('./vector.js');
let Collisions = require('./collisions.js');

module.exports = {
  create: function(){ 
    return Map({
      name: "Ball",
      properties: Map({
        position: Vector.create(48,32),
        velocity: Vector.create(-1.0, 0),
        size: Vector.create(1,1),
        speed: 40
      })
    });
  },
  resolveCollisionWithPlayer: function(ball, player){
    let result = Vector.multiplyVector(Vector.create(-1, 0), ball.getIn(['properties','velocity']));
    let distanceFromCenter = (player.getIn(['properties','position','y']) + player.getIn(['properties','size','y']) / 2) - (ball.getIn(['properties','position','y']) + ball.getIn(['properties','size','y']) / 2);
    let angle = 0;
    if (Math.abs(distanceFromCenter) > player.getIn(['properties','size','y']) / 4){
      angle = Math.atan( -distanceFromCenter / player.getIn(['properties','size','y']));
    }

    if (ball.getIn(['properties', 'velocity', 'x']) > 0) {
      result = Vector.rotateVector(result, -angle);
      ball = ball.setIn(['properties', 'position', 'x'], player.getIn(['properties', 'position', 'x']) - ball.getIn(['properties', 'size', 'x']));
    } else {
      result = Vector.rotateVector(result, angle);
      ball = ball.setIn(['properties', 'position', 'x'], player.getIn(['properties', 'position', 'x']) + player.getIn(['properties', 'size', 'x']));
    }

    return ball.setIn(['properties', 'velocity'], result);
  },
  checkCollisionsWithWalls: function(ball, gameAspects){
    let result = Vector.create(0, 0);
    if (ball.getIn(['properties','velocity','y']) > 0 && ball.getIn(['properties','position','y']) > gameAspects.get('y')){
        result = Vector.multiplyVector(Vector.create(0, -1), ball.getIn(['properties','velocity']));
        ball = ball.setIn(['properties', 'position', 'y'], gameAspects.get('y') - ball.getIn(['properties', 'size', 'y']));
    } else if (ball.getIn(['properties','position','y']) < 0){
        result = Vector.multiplyVector(Vector.create(0, -1), ball.getIn(['properties','velocity']));
        ball = ball.setIn(['properties', 'position', 'y'], 0);
    }


    ball = ball.setIn(['properties', 'velocity'], 
      Vector.add(
        ball.getIn(['properties', 'velocity']),
        Vector.addScalar(result,2)
      )
    );
    return ball;
  },
  update: function(ball, players, dt){
    return ball.setIn(['properties','position'], Vector.addScaledVector(ball.getIn(['properties','position']), ball.getIn(['properties','velocity']), dt * ball.getIn(['properties','speed'])));
  }
}
