"use strict";
let {Map} = require('Immutable');

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

let players = Map({
  "Ronald": Player.create("Ronald"),
  "Oliver": Player.create("Oliver", Map({up: 73, down: 75}))
});

players = players.set("Oliver", Player.setPosition(players.get("Oliver"), 2));

function setup(){
  Renderer.setupRenderer(canvas, 768, 512);

  Tile.setup();
  lastTime = Time.now();
  currentTime = Time.now();

  KeyBindings.setupListeners();

  players.forEach(function(player, id){
    KeyBindings.register(player.get('keybindings'), id);
  })

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
      let id = action.get('subject')
      let player = players.get(id);
      players = players.set(id, Player.handleAction(player, action));
    });
  }
  
  players = players.map(function(player)  {return Player.update(player, dt) } );

  Renderer.clear();
  players.forEach(function(player, id){
    Tile.display(player.get('properties'));
  });

  KeyBindings.resetActions();
  requestAnimationFrame(displayLoop);
}

