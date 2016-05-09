"use strict";

let Immutable = require('immutable');
let Map = Immutable.Map;
let List = Immutable.List;
let Vector = require('./src/vector.js');
let Command = require('./src/command.js');
let Character = require('./src/character.js');
let Time = require('./src/time.js');
let Repository = require('./src/repository.js');
let Diff = require('./src/diff.js');

let timeOverwrite = 0;
Date.now = function() { return new Date().getTime(); }
//Date.now = function() { return timeOverwrite; }

let characters = List([
  Character.create("Ronald"),
  Character.create("Oliver")
]);


let repo = Repository.create();
let newCommands = List();
let gameLoop = function(dt){
  newCommands.forEach(function(command){
    let entry = characters.findEntry(function(character){
      return character.get('name') == command.get('object');
    });
    let after = Character.applyCommand(entry[1],command);
    let result = Diff.generate(entry[1], after);
    repo = repo.push(result);
    characters = characters.set(entry[0], after);
  });
  newCommands = List();

  characters = characters.map(function(character){
    return Character.update(character, dt);
  });
  Time.timeOverwrite += dt;
}

Time.timeOverwrite = 2;
newCommands = newCommands.push(Command.create('changeDirection', "Ronald", {direction: 'left'}));
gameLoop(1);
gameLoop(1);
gameLoop(1);
gameLoop(1);
newCommands = newCommands.push(Command.create('changeDirection', "Ronald", {direction: 'right'}));
gameLoop(1);
let ronald = characters.find(function(character){
  return character.get('name') == "Ronald";
});
ronald = Repository.reverseTime(ronald, repo, 0);
Time.timeOverwrite = 0;
console.log(repo.toJS());
console.log("returned to zero:", ronald.get('position').equals(Vector.create()));
console.log('position', ronald.get('position').toJS());
console.log('velocity', ronald.get('velocity').toJS());

ronald = Repository.forwardTime(ronald, repo, 10);
console.log('position', ronald.get('position').toJS());
console.log('velocity', ronald.get('velocity').toJS());
