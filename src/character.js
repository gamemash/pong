let Immutable = require('immutable');
let Map = Immutable.Map;
let Character = Map;
let Vector = require('./vector.js');
let Time = require('./time.js');

let changeDirection = function(character, data){
  switch(data.get('direction')){
    case 'left':
      return character.set('velocity', Vector.create(1, 0));
    case 'right':
      return character.set('velocity', Vector.create(-1, 0));
    case 'up':
      return character.set('velocity', Vector.create(0, 1));
    case 'down':
      return character.set('velocity', Vector.create(0, -1));
  }
  return character;
}

let stopMoving = function(character, data){
  return character.set('velocity', Vector.create());
}

let commands = {
  changeDirection: changeDirection,
  stopMoving: stopMoving

};

let speed = 50;

module.exports = {
  create: function(name){
    return Character({
      name: name,
      position: Vector.create(),
      velocity: Vector.create()
    });
  },
  applyCommand: function(character, command){
    return commands[command.get('command')](character,command.get('data'));
  },
  update: function(character, dt){
    character = character.setIn(['position', 'x'],character.getIn(['position', 'x']) + character.getIn(['velocity', 'x']) * dt * speed);
    character = character.setIn(['position', 'y'],character.getIn(['position', 'y']) + character.getIn(['velocity', 'y']) * dt * speed);
    return character;
  }

}
