let Immutable = require('Immutable');
let Map = Immutable.Map;
let List = Immutable.List;
let Player = require('./player.js');

let socket;
let openPromises = Map({
  connectToGame: List(),

});

let sendMessage = function(message){
  socket.send(JSON.stringify(message));
}

let accumulatedMessages = List();

let fulfillPromise = function(promises, property, data){
  promises.get(property).forEach(function(resolve){
    resolve(data);
  });
  return promises.set(property, List());
}


let commands = {
  connectToGame: function(gameId){
    return {command: "connectToGame", data: { gameId: gameId}};
  },
  sendActions: function(actions){
    return {command: "sendActions", data: { actions: actions }};
  }
};

let responses = {
  connected: function(data){
    Server.playerId = data.playerId;
    openPromises = fulfillPromise(openPromises, 'connect', data);
  },
  connectedToGame: function(data){
    openPromises = fulfillPromise(openPromises, 'connectToGame', data);
  }
};


let handleMessage = function incoming(message){
  let data = JSON.parse(message.data);
  if (responses[data.response]){
    responses[data.response](data.data);
  } else {
    accumulatedMessages = accumulatedMessages.push(data);
  }
}

let Server = {
  connect: function(address){
    return new Promise(function(resolve, error){
      socket = new WebSocket(address);
      socket.onerror = error;
      socket.onmessage = handleMessage;
      openPromises = openPromises.setIn(['connect', -1], resolve);
    });
  },
  sendActions: function(actions){
    sendMessage(commands.sendActions(actions));
  },
  connectToGame: function(gameid){
    return new Promise(function(resolve, error){
      openPromises = openPromises.setIn(['connectToGame', -1], resolve);
      sendMessage(commands.connectToGame(gameid));
    });
  },
  handleNewMessages: function(players, ball){
    accumulatedMessages.forEach(function(message){
      switch(message.response){
        case 'newPlayer':
          players = players.set(message.data.player.name, Immutable.fromJS(message.data.player));
          break;
        case 'newActions':
          message.data.actions.forEach(function(action){
            let act = Immutable.fromJS(action);
            let player = players.find(function(player){
              return player.get('name') == action.subject;
            });
            players = players.set(action.subject, Player.handleAction(player, act));
          });
          break;
        default:
          console.log('Unhandled message', message.response);
          break;
      }
    });



    accumulatedMessages = List();
    return {
      players: players,
      ball: ball
    };
  }

};

module.exports = Server;
