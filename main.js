// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'path/to/datafile', autoload: true });
// You can issue commands right away

db.find({n:11}, function (err, docs) {
	console.log(docs)
})

//db.find({n:5} function (err, docs) {
//	console.log(docs)
//})

//var doc = { hello: 'world'
//               , n: 11
//               , today: new Date()
//               , nedbIsAwesome: true
//               , notthere: null
//               , notToBeSaved: undefined  // Will not be saved
//               , fruits: [ 'apple', 'orange', 'pear' ]
//               , infos: { name: 'nedb' }
//               };

//db.insert(doc, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
//});
	
var Slack = require('slack-client');
 
var token = process.env.TOKEN;
 
var slack = new Slack(token, true, true);

slack.on('message', function(message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);

    if (message.type === 'message' && user != null) {
        console.log(channel.name + ':' + user.name + ':' + message.text);
        if (message.text.indexOf("has joined the channel") > -1) {
            var indexOfUserNameEnding = message.text.indexOf('>')
            if (indexOfUserNameEnding > -1) {
                var userNameAndID = message.text.substr(0,indexOfUserNameEnding+1).replace('&lt;', '<').replace('&gt;', '>')
                channel.send('Welcome ' + userNameAndID + '! What are you building!?')
		db.insert({userString: userNameandID, state: 'welcomed'})
		//insert user name here with a state that they have been welcomed 
           }
        }
    }
});

slack.login();

