let Immutable = require('immutable');

let Vector = Immutable.Map;

module.exports = {
  create: function(x, y){
    return Vector({ x: x || 0, y: y || 0 });
  },
  subtract: function(vector_a, vector_b){
    return Vector({
      x: vector_b.get('x') - vector_a.get('x'),
      y: vector_b.get('y') - vector_a.get('y')
    });
  },
  add: function(vector_a , vector_b){
    return Vector({
      x: vector_b.get('x') + vector_a.get('x'),
      y: vector_b.get('y') + vector_a.get('y')
    });
  },
  addScalar: function(vector_a, scalar){
    return vector_a.set('x', vector_a.get('x') * scalar).set('y', vector_a.get('y') * scalar);
  },
  addScaledVector: function(vector_a, vector_b, scalar){
    return this.add(vector_a, this.addScalar(vector_b, scalar));
  }
}

