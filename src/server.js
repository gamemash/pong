let Immutable = require('Immutable');
let Map = Immutable.Map;
let List = Immutable.List;

let socket;
let openPromises = Map({
  connectToGame: List(),

});

let accumulatedMessages = List();

let fulfillPromise = function(promises, property, data){
  promises.get(property).forEach(function(resolve){
    resolve(data);
  });
  return promises.set(property, List());
}


let commands = {
  connectToGame: function(gameId){
    return {command: "connectToGame", data: { gameId: gameId}}
  },
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
  connectToGame: function(gameid){
    return new Promise(function(resolve, error){
      openPromises = openPromises.setIn(['connectToGame', -1], resolve);
      socket.send(JSON.stringify(commands.connectToGame(gameid)));
    });
  },
  handleNewMessages: function(players, ball){
    accumulatedMessages.forEach(function(message){
      console.log(message);
      switch(message.response){
        case 'newPlayer':
          players = players.set(message.data.player.name, Immutable.fromJS(message.data.player));
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
