let Immutable = require('immutable');
let Command = Immutable.Map;

module.exports = {
  create: function(command, object, data){
    return Command({
      command: command,
      object: object,
      data: Immutable.fromJS(data)
    });
  }
}
