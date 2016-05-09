"use strict";
let socket = new WebSocket("ws://localhost:5000");
let serverConnected = new Promise(function(resolve){
  socket.onopen = function(event){
    console.log("connected");
    start();
    resolve();
  }
});


let sendToServer = function(data){
  serverConnected.then(function(){
    socket.send(data);
  });
}
//var client = net.connect({port: 8000},
//    function() { 
//    console.log('client connected');
//});
//
//client.on('error', console.error);


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


//
//console.log(socket);
//let client = net.connect({port: 8124}, () => {
//  // 'connect' listener
//  console.log('connected to server!');
//  client.write('world!\r\n');
//});
//


let characters = Immutable.List([
  Character.create("Ronald"),
  Character.create("Oliver")
]);

characters = characters.setIn([1, 'position', 'x'], 100);

let findCharacter = function(characters, name){
  let entry = characters.findEntry(function(character){
    return character.get('name') == name;
  });
  
  return {index: entry[0], character: entry[1]};
}

let secondRepo = Repository.create();
let rollbackTime = Time.now();

let receivedDiffs = Immutable.List();

socket.onmessage = function(event){
  receivedDiffs = Immutable.fromJS(JSON.parse(event.data));
  rollbackTime = receivedDiffs.first().get('timestamp') - 0.001;
}


function handleKeys(keys){
  let newCommands = Immutable.List();

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

  return newCommands;
}



function start(){
  renderLoop();
}
let repo = Repository.create();
let position = 40;
let lastTime = Time.now();
let currentTime = Time.now();
let lastKeys = keys;
let oliverTime = Time.now();

function renderLoop(){
  lastTime = currentTime;
  currentTime = Time.now();
  let dt = currentTime - lastTime;


  newCommands = handleKeys(keys);

  let newDiffs = Immutable.List();
  newCommands.forEach(function(command){
    let {index, character} = findCharacter(characters, command.get('object'));
    let after = Character.applyCommand(character,command);
    let newDiff = Diff.generate(character, after);
    newDiffs = newDiffs.push(newDiff);
    repo = repo.push(newDiff);
    characters = characters.set(index, after);
  });


  if (newCommands.size > 0){
    sendToServer(JSON.stringify(newDiffs.toJS()));
  }

  let {index, character} = findCharacter(characters, "Oliver");
  let oliver = character;
  if (receivedDiffs.size > 0){
    oliver = Repository.reverseTime(oliver, secondRepo, lastTime, rollbackTime);
    receivedDiffs.forEach(function(diff){
      secondRepo = secondRepo.push(diff);
    });
    receivedDiffs = Immutable.List();
    oliverTime = rollbackTime;
  }
  oliver = Repository.forwardTime(oliver, secondRepo, oliverTime, currentTime);
  oliverTime = currentTime;

  newCommands = Immutable.List();

  characters = characters.map(function(character){
    return Character.update(character, dt);
  });
  characters = characters.set(index, oliver);

  context.clearRect(0, 0, canvas.width, canvas.height);
  characters.forEach(function(character){
    context.fillStyle = "red";
    context.fillRect(character.getIn(['position','x']) ,-character.getIn(['position', 'y']), 4, 10);
  });

  

  //context.fillStyle = "blue";
  //context.fillRect(chronoView.getIn(['position','x']) + 100 ,-chronoView.getIn(['position', 'y']), 10, 40);

  requestAnimationFrame(renderLoop);
  lastKeys = keys;
}
