let {Map, List} = require('Immutable');


let registers = Map();
let actions = List();

let createAction = function(action, e){
  return Map({action: action, event: e});
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
  actions = actions.merge(registers.get(e.keyCode).map(function(action) { return createAction(action, e) }));
}

module.exports = {
  setupListeners: function(){
    document.addEventListener("keydown", keyEvent, false);
    document.addEventListener("keyup", keyEvent, false);
  },
  register: function(bindings){
    bindings.forEach(function(keyCode, action){
      registers = registerBinding(registers, keyCode, action);
    });

    console.log(registers.toJS());
  },
  getActions: function(){
    return actions;
  },
  resetActions: function(){
    actions = List();
  }

};
