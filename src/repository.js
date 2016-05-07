
let Immutable = require('immutable');
let List = Immutable.List;
let Repository = List;
let Time = require('./time.js');
let Character = require('./character.js');

module.exports = {
  create: function(){
    return Repository();
  },
  reverseTime: function(object, history, time){
    let currentTime = Time.now();
    let localHistory = history;
    let dt;
    while(currentTime > time){
      let diff = localHistory.last();
      if (diff && diff.get('timestamp') > time){
        dt = diff.get('timestamp') - currentTime;
        object = Character.update(object, dt);
        object = Character.applyDiffdown(object, diff);
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
  forwardTime: function(object, history, time){
    let currentTime = Time.now();
    console.log('currentTime', currentTime);
    let localHistory = history.filter(function(diff){
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
        object = Character.applyDiffup(object, diff);
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

