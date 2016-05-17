"use strict";
let Immutable = require('Immutable');
let Map = Immutable.Map;

let Renderer = require('./src/renderer.js');
let Tile = require('./src/rendering/tile.js');
let ShaderLoader = require('./src/rendering/shader_loader.js');
let Player = require('./src/player.js');
let KeyBindings = require('./src/keybindings.js');
let Time = require('./src/time.js');
let Ball = require('./src/ball.js');
let Vector = require('./src/vector.js');
let Server = require('./src/server.js');

let canvas = document.getElementById('game-canvas');
let errorHandler = function(){
  console.log("something went wrong");
  document.getElementById('no-server-connection').style.display = "block";
}

let playerId;

Promise.all([
  ShaderLoader.load('tile.vert'),
  ShaderLoader.load('tile.frag'),
  Server.connect("ws://localhost:5000")
]).then(function(){
  playerId = Server.playerId;
  setup();
}, errorHandler);

let ball = Ball.create();
let gameAspects = Vector.create(96, 64);
let players = Map({ });


function setup(){
  Renderer.setupRenderer(canvas, Vector.addScalar(gameAspects, 8).toArray());

  Tile.setup();
  lastTime = Time.now();
  currentTime = Time.now();

  KeyBindings.setupListeners();
  Server.connectToGame("a-gameid").then(function(data){
    players = Immutable.fromJS(data.game.players);
    console.log(data);

    KeyBindings.register(players.getIn([playerId, 'keybindings']), playerId);
  });
  //"Ronald": Player.create("Ronald"),
  //"Oliver": Player.create("Oliver", Map({up: 73, down: 75}))
  //players = players.set("Ronald", Player.setPosition(players.get("Ronald"), 1));
  //players = players.set("Oliver", Player.setPosition(players.get("Oliver"), 2));


  displayLoop();
}


function checkLoseCondition(ball, players, gameAspects){
  if (ball.getIn(['properties', 'position', 'x']) < 0 || ball.getIn(['properties', 'position', 'x']) > gameAspects.get('x')){
    ball = Ball.create();
  }
  return ball;

}

let lastTime;
let currentTime;
function displayLoop(){
  lastTime = currentTime;
  currentTime = Time.now();
  let dt = currentTime - lastTime;

  let keyActions = KeyBindings.getActions();
  if (keyActions.size > 0){
    keyActions.forEach(function(action){
      let id = action.get('subject')
      let player = players.get(id);
      players = players.set(id, Player.handleAction(player, action));
    });
  }


  let updated = Server.handleNewMessages(players, ball);
  players = updated.players;
  ball = updated.ball;
  
  players = players.map(function(player)  {return Player.update(player, dt) } );
  ball = Ball.update(ball, players, dt);
  ball = Ball.checkCollisionsWithPlayers(ball, players);
  ball = Ball.checkCollisionsWithWalls(ball, gameAspects);
  ball = checkLoseCondition(ball, players, gameAspects);

  Renderer.clear();
  players.forEach(function(player, id){
    Tile.display(player.get('properties'));
  });

  Tile.display(ball.get('properties'));

  KeyBindings.resetActions();
  requestAnimationFrame(displayLoop);
}

