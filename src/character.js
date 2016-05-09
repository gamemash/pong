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
  }
  return character;
}

let commands = {
  changeDirection: changeDirection
};

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
    character = character.setIn(['position', 'x'],character.getIn(['position', 'x']) + character.getIn(['velocity', 'x']) * dt);
    character = character.setIn(['position', 'y'],character.getIn(['position', 'y']) + character.getIn(['velocity', 'y']) * dt);
    return character;
  }

}
