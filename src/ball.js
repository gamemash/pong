let {Map} = require('Immutable');
let Vector = require('./vector.js');
let Collisions = require('./collisions.js');

module.exports = {
  create: function(){ 
    return Map({
      name: "Ball",
      properties: Map({
        position: Vector.create(48,32),
        velocity: Vector.create(-0.5, -1),
        size: Vector.create(2,2),
        speed: 40
      })
    });
  },
  checkCollisionsWithPlayers: function(ball, players){
    players.forEach(function(player){
      if(Collisions.detect(ball, player)){
        let result = Vector.multiplyVector(Vector.create(-1, 0), ball.getIn(['properties','velocity']));

        if (ball.getIn(['properties', 'velocity', 'x']) > 0) {
          ball = ball.setIn(['properties', 'position', 'x'], player.getIn(['properties', 'position', 'x']) - ball.getIn(['properties', 'size', 'x']));
        } else {
          ball = ball.setIn(['properties', 'position', 'x'], player.getIn(['properties', 'position', 'x']) + player.getIn(['properties', 'size', 'x']));
        }

        ball = ball.setIn(['properties', 'velocity'], 
          Vector.add(
            ball.getIn(['properties', 'velocity']),
            Vector.addScalar(result,2)
          )
        );
      }
    });
    return ball;
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
