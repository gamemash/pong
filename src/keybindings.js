let {Map, List} = require('Immutable');


let registers = Map();
let actions = List();

let createAction = function(action, subject){
  return Map({action: action, subject: subject});
}

let registerBinding = function(registers, keyCode, action){
  if (registers.has(keyCode)){
    return registers.set(keyCode, registers.get(keyCode).push(action));
  } else {
    return registers.set(keyCode, List([action]));
  }
}

let keyEvent = function(e){
  if (e.repeat) return;
  if (!registers.has(e.keyCode)) return;
  registers.get(e.keyCode).forEach(function(action) {
    actions = actions.push(action.set('event', e)); 
  });
}

module.exports = {
  setupListeners: function(){
    document.addEventListener("keydown", keyEvent, false);
    document.addEventListener("keyup", keyEvent, false);
  },
  register: function(bindings, subject){
    bindings.forEach(function(keyCode, action){
      registers = registerBinding(registers, keyCode, createAction(action, subject));
    });
  },
  getActions: function(){
    return actions;
  },
  resetActions: function(){
    actions = List();
  }

};
