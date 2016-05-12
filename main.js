"use strict";
let Immutable = require('Immutable');

let Renderer = require('./src/renderer.js');
let Tile = require('./src/rendering/tile.js');
let ShaderLoader = require('./src/rendering/shader_loader.js');
let Player = require('./src/player.js');
let KeyBindings = require('./src/keybindings.js');
let Time = require('./src/time.js');

let canvas = document.getElementById('game-canvas');

Promise.all([
  ShaderLoader.load('tile.vert'),
  ShaderLoader.load('tile.frag')
]).then(function(){
  setup();
});

let players = Immutable.List([
  Player.create("Ronald")
  ]);

function setup(){
  Renderer.setupRenderer(canvas, 768, 512);

  Tile.setup();
  lastTime = Time.now();
  currentTime = Time.now();

  KeyBindings.setupListeners();

  for (let player of players){
    KeyBindings.register(player.get('keybindings'));
  }

  displayLoop();
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
      let player = players.get(0);
      players = players.set(0, Player.handleAction(player, action));
    });
  }
  
  players = players.map(function(player)  {return Player.update(player, dt) } );

  Renderer.clear();
  for(let player of players){
    Tile.display(player.get('properties'));
  }

  KeyBindings.resetActions();
  requestAnimationFrame(displayLoop);
}

