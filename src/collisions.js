let {Map} = require('Immutable');
let Vector = require('./vector.js');


let boundingBox = function(obj_a, obj_b){
  return (obj_a.getIn(['position','x']) < obj_b.getIn(['position','x']) + obj_b.getIn(['size','x']) &&
     obj_a.getIn(['position','x']) + obj_a.getIn(['size','x']) > obj_b.getIn(['position','x']) &&
     obj_a.getIn(['position','y']) < obj_b.getIn(['position','y']) + obj_b.getIn(['size','y']) &&
     obj_a.getIn(['size','y']) + obj_a.getIn(['position','y']) > obj_b.getIn(['position','y']));
}

let Collisions = {
  detect: function(object_a, object_b){
    return boundingBox(object_a.get('properties'), object_b.get('properties'));
  }
};

module.exports = Collisions;

