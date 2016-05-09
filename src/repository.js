
let Immutable = require('immutable');
let Map = Immutable.Map;
let List = Immutable.List;
let Time = require('./time.js');
let Character = require('./character.js');
let Diff = require('./diff.js');


module.exports = {
  create: function(){
    return List();
  },
  reverseTime: function(object, repository, fromTime, toTime){
    let currentTime = fromTime;
    let localHistory = repository;
    let dt;
    while(currentTime > toTime){
      let diff = localHistory.last();
      if (diff && diff.get('timestamp') > toTime){
        dt = diff.get('timestamp') - currentTime;
        object = Character.update(object, dt);
        object = Diff.applyDown(object, diff.get('diff'));
        localHistory = localHistory.pop();
      } else {
        dt = toTime - currentTime;
        object = Character.update(object, dt);
      }
      currentTime += dt;
    }
    return object;
  },
  forwardTime: function(object, repository, fromTime, toTime){
    let currentTime = fromTime;
    let localHistory = repository.filter(function(diff){
      return diff.get('timestamp') >= currentTime;
    });

    let dt;

    while(currentTime < toTime){
      let diff = localHistory.first();

      if (diff && diff.get('timestamp') < toTime){
        dt = diff.get('timestamp') - currentTime;
        object = Character.update(object, dt);
        object = Diff.applyUp(object, diff.get('diff'));
        localHistory = localHistory.shift();
      } else {
        dt = toTime - currentTime;
        object = Character.update(object, dt);
      }
      currentTime += dt;
    }
    return object;
  }
}

