"use strict";

let Immutable = require('immutable');
let Diff = require('./src/diff.js');
let Repository = require('./src/repository.js');
let Time = require('./src/time.js');

let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({ port: 5000 });

let repo = Repository.create();

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let diff = Immutable.fromJS(JSON.parse(message));
    repo = repo.push(diff);
    setTimeout(function(){
      ws.send(message);
    }, 50);
  });
  ws.on('open', function(){
    ws.send(JSON.stringify(repo.toJS()));
  });
  ws.on('close', function(){
    console.log('lost connection');
  });
});

