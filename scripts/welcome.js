// Description
//  Welcome new users upon entering specific channels
//
//  Configuration:
//    HUBOT_WELCOME_ROOMS, comma separated
//
//  Author:
//  Sam Couch <sam@couch.rocks>

var _ = require('underscore')

module.exports = function(robot){
  var WELCOME_ROOMS = (process.env.HUBOT_WELCOME_ROOMS)? process.env.HUBOT_WELCOME_ROOMS.replace(/\s/g, '').split(','):['general']
  var WELCOME_MESSAGES = ['What are you working on?', 'Tell us about yourself!', 'Anything we can help you with?']
  /**
   * Build the slack-specific string for @ replying users.
   */
  function buildUser(user){
    return '<@' + user.id + '|' + user.name + '>'
  }

  robot.enter(function(msg){
    if (WELCOME_ROOMS.indexOf(msg.envelope.message.room) != -1)
      msg.send('Welcome ' + buildUser(msg.envelope.user) + '! ' + _.sample(WELCOME_MESSAGES))
  })
}
