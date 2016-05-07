let Immutable = require('immutable');
let Command = Immutable.Map;

module.exports = {
  create: function(command, data){
    return Command({
      command: command,
      data: Immutable.fromJS(data)
    });
  }
}
