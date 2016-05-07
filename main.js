"use strict";

let Immutable = require('immutable');
let Map = Immutable.Map;
let List = Immutable.List;
let Vector = require('./src/vector.js');
let Command = require('./src/command.js');
let Character = require('./src/character.js');
let Time = require('./src/time.js');

let timeOverwrite = 0;
Date.now = function() { return new Date().getTime(); }
//Date.now = function() { return timeOverwrite; }

let forwardTime = function(object, history, time){
  let currentTime = Time.now();
  console.log('currentTime', currentTime);
  let localHistory = history.filter(function(diff){
    return diff.get('timestamp') >= currentTime;
  });

  let dt;

  while(currentTime < time){
    let diff = localHistory.first();

    if (diff && diff.get('timestamp') < time){
      console.log('diff timestamp', diff.get('timestamp'), diff.toJS());
      dt = diff.get('timestamp') - currentTime;
      console.log('dt', dt);
      object = Character.update(object, dt);
      object = Character.applyDiffup(object, diff);
      localHistory = localHistory.shift();
    } else {
      dt = time - currentTime;
      object = Character.update(object, dt);
    }
    currentTime += dt;
  }
  return object;

}

let reverseTime = function(object, history, time){
  let currentTime = Time.now();
  let localHistory = history;
  let dt;
  while(currentTime > time){
    let diff = localHistory.last();
    if (diff && diff.get('timestamp') > time){
      dt = diff.get('timestamp') - currentTime;
      object = Character.update(object, dt);
      object = Character.applyDiffdown(object, diff);
      console.log(diff.toJS());
      localHistory = localHistory.pop();
    } else {
      dt = time - currentTime;
      object = Character.update(object, dt);
    }
    currentTime += dt;
  }
  return object;
}

let newCommands = List();
let history = List();
let gameLoop = function(dt){
  newCommands.forEach(function(command){
    let after = Character.applyCommand(command, ronald);
    let result = Character.generateDiff(ronald, after);
    history = history.push(result);
    ronald = after;
  });
  newCommands = List();

  ronald = Character.update(ronald, dt);
  Time.timeOverwrite += dt;
}

let ronald = Character.create("Ronald");
//console.log('position', ronald.get('position').toJS());
//console.log('velocity', ronald.get('velocity').toJS());

Time.timeOverwrite = 2;
newCommands = newCommands.push(Command.create('changeDirection', {direction: 'left'}));
gameLoop(1);
//console.log(ronald.get('velocity').toJS());
gameLoop(1);
gameLoop(1);
gameLoop(1);
newCommands = newCommands.push(Command.create('changeDirection', {direction: 'right'}));
gameLoop(1);
//console.log(ronald.get('velocity').toJS());
ronald = reverseTime(ronald, history, 0);
Time.timeOverwrite = 0;
//console.log("returned to zero:", ronald.get('position').equals(Vector.create()));
console.log('position', ronald.get('position').toJS());
console.log('velocity', ronald.get('velocity').toJS());
ronald = forwardTime(ronald, history, 10);
console.log('position', ronald.get('position').toJS());
console.log('velocity', ronald.get('velocity').toJS());
