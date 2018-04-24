const mongoose = require('mongoose');
var Schema = mongoose.Schema;


// notification
var notificationSchema = new Schema({
    rest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rest_info',
        required: true
    },
    cust_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    collection: 'notification'
});

notificationSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});
var notification = mongoose.model('notification', notificationSchema);
module.exports = {
    notification
};