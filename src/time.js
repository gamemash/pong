let Time = {
  timeOverwrite: 0,
  now: function(){ return Time.timeOverwrite; }
};

module.exports = Time;
