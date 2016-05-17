let Immutable = require('Immutable');
let Vector = require('./vector.js');

let defaultKeyBindings = Immutable.Map({
  start: 30,
  up: 87,
  down: 83
});

let defaultProperties = Immutable.Map({
  position: Vector.create(10, 30.5),
  velocity: Vector.create(0, 0),
  speed: 40,
  size: Vector.create(1,4)

});


module.exports = {
  create: function(name, keyBindings, properties){
    return Immutable.Map({
      name: name,
      keybindings: (keyBindings ? defaultKeyBindings.merge(keyBindings) : defaultKeyBindings),
      properties: (properties ? defaultKeyBindings.merge(properties) : defaultProperties)
    });
  },
  setPosition: function(player, position){
    let playerPositions = [,10,86,14, 82];
    return player.setIn(['properties', 'position', 'x'], playerPositions[position]);
  },
  handleAction: function(player, actionInfo){
    let action = actionInfo.get('action');
    if(actionInfo.get('type') == "keydown"){
      switch(action){
        case 'up':
          return player.setIn(['properties','velocity'], Vector.create(0, 1));
        case 'down':
          return player.setIn(['properties','velocity'], Vector.create(0,-1));
      }
    } else {
      return player.setIn(['properties','velocity'], Vector.create(0,0));
    }
  },
  update: function(player, dt){
    return player.setIn(['properties','position'], Vector.addScaledVector(player.getIn(['properties','position']), player.getIn(['properties','velocity']), dt * player.getIn(['properties','speed'])));
  }
};

