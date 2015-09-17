// Description
//  Welcome new users upon entering specific channels
//
//  Author:
//  Sam Couch <sam@couch.rocks>

var _ = require('underscore')
var scheduler = require('node-schedule')

module.exports = function(robot){
  var WELCOME_ROOMS = ['general']
  var WELCOME_MESSAGES = ['Working on anything interesting?', 'Tell us about yourself!', 'Anything we can help you with?']

  /** check the welcome queue every 5 minutes */
  var rule =  new scheduler.RecurrenceRule()
  rule.minute = new scheduler.Range(0, 59, 5)
  var welcomeSchedule = scheduler.scheduleJob(rule, function() {
      welcomeUsers()
  })

  /** Build the slack-specific string for @ replying users. */
  function buildUser(user){
    return '<@' + user.id + '>'
  }

  /** return array of user strings to welcome */
  function getUsers(){
    return (_.map(getWelcomeQueue(), function(user){
      return buildUser(user)
    }))
  }

  function welcomeUsers(){
    var users = getUsers().join(', ')
    if (!_.isEmpty(users)){
      var message = 'Welcome ' + users + '! ' + WELCOME_MESSAGES[nextWelcomeMessageIndex()]

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
    //ensure only unique users get added
    if(_.isUndefined(_.find(queue, {id: user.id}))){
      queue.push({
        id: user.id
      })
      updateBrain(queue)
    }
  }

    /**  Get and increment the welcome message index. */
  function nextWelcomeMessageIndex(){
    lastMessageIndex = (robot.brain.get("last_welcome_index") || 0) % WELCOME_MESSAGES.length;
    robot.brain.set("last_welcome_index", lastMessageIndex + 1);
    return lastMessageIndex;
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
