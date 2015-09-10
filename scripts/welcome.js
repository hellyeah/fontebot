module.exports = function(robot){
  var WELCOME_ROOMS = ['bot']

  function buildUser(user){
    return '<@' + user.id + '|' + user.name + '>'
  }

  robot.enter(function(msg){
    if (WELCOME_ROOMS.indexOf(msg.envelope.message.room) != -1)
      msg.send('Welcome ' + buildUser(msg.envelope.user))
  })
}
