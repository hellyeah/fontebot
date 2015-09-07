// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'database.nedb', autoload: true });
// You can issue commands right away

db.find({n:11}, function (err, docs) {
	console.log(docs)
})
	
var Slack = require('slack-client');
 
//set token by calling "TOKEN=_token_ node main.js" to run fontebot
var token = process.env.TOKEN;
 
var slack = new Slack(token, true, true);

//expected input "@userName"
var makeMention = function(userId) {
    //not sure if I need the replace...could just substitute in html entities directly
    return ('<@' + userId + '>').replace('&lt;', '<').replace('&gt;', '>');
}

var getFirstTaggedUserID = function(message) {
    var indexOfUserNameBeginning = message.text.indexOf('<@')
    var indexOfUserNameEnding = message.text.indexOf('>')
    if (indexOfUserNameBeginning > -1 && indexOfUserNameEnding > -1) {
        return userNameAndID = message.text.substr(indexOfUserNameBeginning+2,(indexOfUserNameEnding-indexOfUserNameBeginning-2))
    } else {
        return null
    }
}

var whoHasJoined = function(message) {
    if (message.text.indexOf("has joined the channel") > -1) {
        return getFirstTaggedUserID(message)
    } else {
        return null
    }
}

var whoWasPlussed = function(message) {
    if (message.text.indexOf("++") > -1) {
        return plusUser(getFirstTaggedUserID(message))
    } else {
        return null
    }
}

//**should also track who plussed them
var plusUser = function(userID, userIDWhoGavePlus) {
    //console.log('plussed ' + userID)
    db.insert({userID: userID, action: '++', giver: userIDWhoGavePlus})
    return userID
}

var howManyPlusses = function(userID, callback) {
    //counts how many ++ lines in database for a userID
    db.find({userID: userID, action:"++"}, function (err, docs) {
        if (err) {
            callback(0)
        } else {
            callback(docs.length)
        }
    })
}

var roll = function(message) {
  //n = typeof n !== 'undefined' ?  n : 1;
  if (message.text.substr(0,4) === "roll") {
    var r = /\d+/
    var digits = message.text.match(r)
    if (digits) {
      return ('Random number between 1 and ' + digits + ': ' + Math.floor((Math.random() * digits) + 1))
    } else {
      return ('Random number between 1 and 6: ' + Math.floor((Math.random() * 6) + 1))
    }
  } else {
    return null
  }
}

//under construction
//should check state before welcoming
// var checkUserState = function(userID, callback) {
//     db.find({userID}, function(err, docs) {
//         if (err) {
//             callback(null)
//         } 
//         //filter for objects that have state property w/ underscore
//         else if (!docs.hasOwnProperty('state')) {
//             callback(null)
//         } else {
//             callback(docs.)
//         }
//     })
// }

//function to check what a person is building

var welcomeQueue = {}

function queueWelcome (channel, msg) {
  if (channel.name in welcomeQueue) {
    welcomeQueue[channel.name].push([channel, msg])
  } else {
    welcomeQueue[channel.name] = [[channel, msg]]
  }
}

setInterval(function () {

  for (var k in welcomeQueue) {
    if (welcomeQueue[k].length > 0) {
      var mentions = welcomeQueue[k].map(function (u) { return makeMention(u) }).join(' ')
      channel.send('Welcome ' + mentions + '! What are you building?')
    }
  }

  welcomeQueue = {}

}, 10 * 60 * 1000) // 10 minutes


//any writes to channel go here
slack.on('message', function(message) {
  var channel = slack.getChannelGroupOrDMByID(message.channel);
  var user = slack.getUserByID(message.user);

  if (message.type === 'message' && user != null) {
    console.log(channel.name + ':' + user.name + ':' + message.text);
    var userNameJoined = whoHasJoined(message)
    var userNamePlussed = whoWasPlussed(message)
    var rollMessage = roll(message)

    //if someone joined, welcome them and change their state to welcomed
    if (userNameJoined != null) {
      queueWelcome(channel, userNameJoined)
      db.insert({userID: userNameJoined, state: 'welcome'})
    } 
    //if someone was plussed, let the channel know how many points they have
    if (userNamePlussed != null) {
      howManyPlusses(userNamePlussed, function(plusCount) {
        channel.send(makeMention(userNamePlussed) + ' has ' + plusCount + ' points')
      })
    }

    if (rollMessage != null) {
      channel.send(rollMessage)
    }
  }
});

slack.login();
