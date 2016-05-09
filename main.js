"use strict";

let Immutable = require('immutable');
let Command = require('./src/command.js');
let Character = require('./src/character.js');
let Diff = require('./src/diff.js');
let Repository = require('./src/repository.js');
let Time = require('./src/time.js');

var canvas = document.getElementById("game-canvas");
var context = canvas.getContext("2d");


let newCommands = Immutable.List();
let keys = Immutable.Map();
let handleKeydown = function(e){
  keys = keys.set(e.keyCode, true);
}

let handleKeyup = function(e){
  keys = keys.set(e.keyCode, false);
}

document.addEventListener("keyup",handleKeyup,false);
document.addEventListener("keydown",handleKeydown,false);


let characters = Immutable.List([
  Character.create("Ronald"),
]);

let findCharacter = function(characters, name){
  let entry = characters.findEntry(function(character){
    return character.get('name') == name;
  });
  
  return {index: entry[0], character: entry[1]};
}


let repo = Repository.create();
let chronoView = characters.get(0);
let position = 40;
let lastTime = Time.now();
let lastKeys = keys;
function renderLoop(){
  let nextLastTime = Time.now();
  let dt = 1/60;


  if (keys.get(87) != lastKeys.get(87)){
    if (keys.get(87)){
      newCommands = newCommands.push(Command.create('changeDirection', "Ronald", {direction: 'up'}));
    } else {
      newCommands = newCommands.push(Command.create('stopMoving', "Ronald", {}));
    }
  }

  if (keys.get(83) != lastKeys.get(83)){
    if (keys.get(83)){
      newCommands = newCommands.push(Command.create('changeDirection', "Ronald", {direction: 'down'}));
    } else {
      newCommands = newCommands.push(Command.create('stopMoving', "Ronald", {}));
    }
  }


  newCommands.forEach(function(command){
    let {index, character} = findCharacter(characters, command.get('object'));
    let after = Character.applyCommand(character,command);
    repo = repo.push(Diff.generate(character, after));
    characters = characters.set(index, after);
  });

  newCommands = Immutable.List();

  characters = characters.map(function(character){
    return Character.update(character, dt);
  });

  context.clearRect(0, 0, canvas.width, canvas.height);
  characters.forEach(function(character){
    context.fillStyle = "red";
    context.fillRect(character.getIn(['position','x']) ,-character.getIn(['position', 'y']), 10, 40);
  });

  
  chronoView = Repository.forwardTime(chronoView, repo, lastTime - 1, lastTime + dt - 1);


  context.fillStyle = "blue";
  context.fillRect(chronoView.getIn(['position','x']) + 100 ,-chronoView.getIn(['position', 'y']), 10, 40);

  lastTime = nextLastTime;
  requestAnimationFrame(renderLoop);
  lastKeys = keys;
}

renderLoop();
