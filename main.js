	
var Slack = require('slack-client');
 
var token = 'MY SUPER SECRET BOT TOKEN';
 
var slack = new Slack(token, true, true);

slack.on('message', function(message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);
 
    if (message.type === 'message' && !user.is_bot) {
        console.log(channel.name + ':' + user.name + ':' + message.text);
        if (message.text.indexOf("has joined the channel") > -1) {
            var indexOfUserNameEnding = message.text.indexOf('>')
            if (indexOfUserNameEnding > -1) {
                var userNameAndID = message.text.substr(0,indexOfUserNameEnding+1).replace('&lt;', '<').replace('&gt;', '>')
                channel.send('Welcome ' + userNameAndID + '! What are you building!?')
            }
        }
    }
});

slack.login();

