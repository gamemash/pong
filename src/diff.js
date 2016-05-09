let Immutable = require('immutable');
let Map = Immutable.Map;
let List = Immutable.List;
let Time = require('./time.js');


let create = function(timestamp, diff){
  return Map({
    timestamp: timestamp,
    diff: diff
  });
}

let diff = function(before, after){
  return before.map(function(value, key){
    if (Map.isMap(value)){
      return diff(before.get(key), after.get(key));
    } else if (typeof value === 'string'){
      return "";
    } else {
      return after.get(key) - before.get(key);
    }
  });
}

let apply = function(object, diff){
  
  diff.forEach(function(value, key){
    if (Map.isMap(value)){
      object = object.set(key, apply(object.get(key), value));
    } else if (typeof value === 'string'){
      object = object.set(key, object.get(key) - value);
    } else {
      object = object.set(key, object.get(key) - value);
    }

  });
  return object;
}
module.exports = {
  generate: function(before, after){
    let timestamp = Time.now();
    return create(timestamp, diff(before, after));
  },
  apply: apply

};
