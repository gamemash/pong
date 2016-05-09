Date.now = function() { return new Date().getTime(); }

let Time = {
  timeOverwrite: 0,
  now: function(){ return Date.now() / 1000; }
};

module.exports = Time;
