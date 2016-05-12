let Immutable = require('Immutable');
let Vector = require('./vector.js');

let defaultKeyBindings = Immutable.Map({
  start: 30,
  up: 87,
  down: 83
});

let defaultProperties = Immutable.Map({
  position: Vector.create(10, 10),
  velocity: Vector.create(0, 0),
  speed: 20
});

module.exports = {
  create: function(name, keyBindings, properties){
    return Immutable.Map({
      name: name,
      keybindings: (keyBindings ? keyBindings : defaultKeyBindings),
      properties: (properties ? properties : defaultProperties)
    });
  },
  handleAction: function(player, action){
    console.log(action);
    switch(action){
      case 'up':
        return player.setIn(['properties','velocity'], Vector.create(0, 1));
      case 'down':
        return player.setIn(['properties','velocity'], Vector.create(0,-1));
    }
  },
  update: function(player, dt){
    return player.setIn(['properties','position'], Vector.addScaledVector(player.getIn(['properties','position']), player.getIn(['properties','velocity']), dt * player.getIn(['properties','speed'])));
  }
};

