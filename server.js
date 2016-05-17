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
  return Map({
    players: newPlayer(Map(), playerId)
  });
}

function newPlayer(players, playerId){
  let player = Player.create(playerId);
  player = Player.setPosition(player, players.size + 1);
  return players.set(playerId, player);
}

let responses = {
  newPlayer: function(player){
    return {response: 'newPlayer', data: { player: player }}
  },
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
      let existingPlayers = games.getIn([gameId, 'players']);
      games = games.setIn([gameId, 'players'], newPlayer(games.getIn([gameId, 'players']),id));

      if (games.get(gameId).size > 0){
        let addedPlayer = games.getIn([gameId, 'players']).last();
        existingPlayers.forEach(function(player){
          notifyClient(player.get('name'), responses.newPlayer(addedPlayer));
        });
      }
    } else {
      games = games.set(gameId, newGame(id));
    }
    return responses.connectedToGame(id, gameId);
  }
}

function handleMessage(ws, id, message){
  let response = commands[message.command](id, message.data);
  if (response){
    ws.send(JSON.stringify(response));
  }
}

function notifyClient(id, message){
  if (connections.has(id)){
    connections.get(id).send(JSON.stringify(message));
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

