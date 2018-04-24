// // var mongoUrl = process.env.MONGODB_URI;
var mongoUrl = "mongodb://kumbhanibhavesh:alex9099414492@ds145019.mlab.com:45019/restaurant";
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