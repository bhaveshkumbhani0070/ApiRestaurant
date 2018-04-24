var mongoUrl = process.env.MONGODB_URI;
if (!mongoUrl) {
    console.log('PLease export mongoUrl');
    console.log('Use following commmand');
    console.log('*********');
    console.log('export MONGODB_URI=YOUR_MONGO_URL');
}

var mongoose = require('mongoose');
mongoose.connect(mongoUrl);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connected to DB");
    //do operations which involve interacting with DB.
});