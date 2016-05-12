let {Map, List} = require('Immutable');


let registers = Map();
let actions = List();

let registerBinding = function(registers, keyCode, action){
  if (registers.has(keyCode)){
    return registers.set(keyCode, registers.get(keyCode).push(action));
  } else {
    return registers.set(keyCode, List([action]));
  }
}

let keyupEvent = function(e){}
let keydownEvent = function(e){
  if (e.repeat) return;
  actions = actions.merge(registers.get(e.keyCode));
}

module.exports = {
  setupListeners: function(){
    document.addEventListener("keydown", keydownEvent, false);
    document.addEventListener("keyup", keyupEvent, false);
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
