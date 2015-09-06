// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'path/to/datafile', autoload: true });
// You can issue commands right away

db.find({userID:"U08A0226R", action:"++"}, function (err, docs) {
	console.log(docs.length)
})