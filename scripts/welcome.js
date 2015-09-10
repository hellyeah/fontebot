// Description
//  Welcome new users upon entering specific channels
//
//  Author:
//  Sam Couch <sam@couch.rocks>

var _ = require('underscore')
var scheduler = require('node-schedule')

module.exports = function(robot){
  var WELCOME_ROOMS = ['general']
  var WELCOME_MESSAGES = ['What are you working on?', 'Tell us about yourself!', 'Anything we can help you with?']

  /** check the welcome queue every 10 minutes */
  var welcomeSchedule = scheduler.scheduleJob('10 * * * * *', function() {
      welcomeUsers()
  });

  /** Build the slack-specific string for @ replying users. */
  function buildUser(user){
    return '<@' + user.id + '|' + user.name + '>'
  }

  /** return array of user strings to welcome */
  function getUsers(){
    return (_.map(getWelcomeQueue(), function(user){
      return buildUser(user)
    }))
  }

  function welcomeUsers(){
    console.log(new Date())
    var users = getUsers().join(', ')
    if (!_.isEmpty(users)){
      var message = 'Welcome ' + users + '! ' + _.sample(WELCOME_MESSAGES)

      /** clear out the queue */
      updateBrain([])

      robot.messageRoom('#general', message)
    }
  }

  // Return all the users who haven't been welcomed yet
  function getWelcomeQueue() {
    return robot.brain.get("welcome_queue") || [];
  }

  /** add user to the queue */
  function addUser(user){
    var queue = getWelcomeQueue()
    queue.push({
      id: user.id,
      name: user.name
    })
    updateBrain(queue)
    console.log('added' + user)
  }

  /** set the welcome_queue */
  function updateBrain(queue){
    robot.brain.set('welcome_queue', queue)
  }

  robot.enter(function(msg){
    if (WELCOME_ROOMS.indexOf(msg.envelope.message.room) != -1)
      addUser(msg.envelope.user)
  })
}
