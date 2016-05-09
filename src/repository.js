
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
  reverseTime: function(object, repository, time){
    let currentTime = Time.now();
    let localHistory = repository;
    let dt;
    while(currentTime > time){
      let diff = localHistory.last();
      if (diff && diff.get('timestamp') > time){
        dt = diff.get('timestamp') - currentTime;
        object = Character.update(object, dt);
        object = Diff.apply(object, diff.get('diff'));
        console.log(diff.toJS());
        localHistory = localHistory.pop();
      } else {
        dt = time - currentTime;
        object = Character.update(object, dt);
      }
      currentTime += dt;
    }
    return object;
  },
  forwardTime: function(object, repository, time){
    let currentTime = Time.now();
    console.log('currentTime', currentTime);
    let localHistory = repository.filter(function(diff){
      return diff.get('timestamp') >= currentTime;
    });

    let dt;

    while(currentTime < time){
      let diff = localHistory.first();

      if (diff && diff.get('timestamp') < time){
        console.log('diff timestamp', diff.get('timestamp'), diff.toJS());
        dt = diff.get('timestamp') - currentTime;
        console.log('dt', dt);
        object = Character.update(object, dt);
        object = Diff.apply(object, diff.get('diff'));
        localHistory = localHistory.shift();
      } else {
        dt = time - currentTime;
        object = Character.update(object, dt);
      }
      currentTime += dt;
    }
    return object;
  }
}

