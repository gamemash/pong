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


let repo = Repository.create();
let newCommands = List();
let gameLoop = function(dt){
  newCommands.forEach(function(command){
    let after = Character.applyCommand(command, ronald);
    let result = Character.generateDiff(ronald, after);
    repo = repo.push(result);
    ronald = after;
  });
  newCommands = List();

  ronald = Character.update(ronald, dt);
  Time.timeOverwrite += dt;
}

let ronald = Character.create("Ronald");
let before = ronald;
Time.timeOverwrite = 2;
newCommands = newCommands.push(Command.create('changeDirection', {direction: 'left'}));
gameLoop(1);
let after = ronald
let diff = Diff.generate(before, after);
let reapplied = Diff.apply(before, diff.get('diff'));
console.log('diff', diff.toJS());
console.log('reapplied', reapplied.toJS());
//console.log('position', ronald.get('position').toJS());
//console.log('velocity', ronald.get('velocity').toJS());

////console.log(ronald.get('velocity').toJS());
//gameLoop(1);
//gameLoop(1);
//gameLoop(1);
//newCommands = newCommands.push(Command.create('changeDirection', {direction: 'right'}));
//gameLoop(1);
////console.log(ronald.get('velocity').toJS());
//ronald = Repository.reverseTime(ronald, repo, 0);
//Time.timeOverwrite = 0;
//console.log("returned to zero:", ronald.get('position').equals(Vector.create()));
//console.log('position', ronald.get('position').toJS());
//console.log('velocity', ronald.get('velocity').toJS());
//ronald = Repository.forwardTime(ronald, repo, 10);
//console.log('position', ronald.get('position').toJS());
//console.log('velocity', ronald.get('velocity').toJS());
