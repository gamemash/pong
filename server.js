"use strict";

let Immutable = require('immutable');
let Map = Immutable.Map;
let List = Immutable.List;
let Player = require('./src/player.js');
let guid = require('./src/guid.js');

let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({ port: 5000 });

let connections = Map();
let games = Map();

function getConnectionID(ws){
  return connections.findEntry(function(value){ return value == ws; })[0];
}

function newGame(playerId){
  let players = {};
  players[playerId] = Player.create(playerId);
  return Map({
    players: Immutable.fromJS(players)
  });
}

let responses = {
  connected: function(id){
    return {response: 'connected', data: { playerId: id } };
  },
  connectedToGame: function(playerId, gameId){
    return {response: 'connectedToGame', data: { game: games.get(gameId).toJS() }};
  }
  
}

let commands = {
  connecting: function(id, data){
    connections = connections.set(id, data.ws);
    return responses.connected(id);
  },
  connectToGame: function(id, data){
    let gameId = data.gameId;
    if (games.has(gameId)){
      games = games.setIn([gameId, 'players', id], Player.create(id));
    } else {
      games = games.set(gameId, newGame(id));
    }
    console.log("connected", id, "to game", gameId, " - ", games.get(gameId));
    return responses.connectedToGame(id, gameId);
  }
}

function handleMessage(ws, id, message){
  let response = commands[message.command](id, message.data);
  if (response){
    ws.send(JSON.stringify(response));
  }
}


wss.on('connection', function connection(ws) {
  handleMessage(ws, guid(), {command: 'connecting', data: { ws: ws }});

  ws.on('message', function incoming(message) {
    handleMessage(ws, getConnectionID(ws), JSON.parse(message));
    //ws.send(message);
  });

  ws.on('close', function(){
    let id = getConnectionID(ws);
    games = games.map(function(game){ 
      return game.set('players', game.get('players').filter(function(player){
          return player.get('name') != id;
        })
      );
    });
    connections = connections.delete(id);
  });
});

