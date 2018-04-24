const mongoose = require('mongoose');
var Schema = mongoose.Schema;


// booking
var bookingSchema = new Schema({
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
    time: {
        type: String,
        required: true
    },
    people: {
        type: Number,
        required: true
    },
    comments: {
        type: String
    },
    status: {
        type: String,
        required: true
    }
}, {
    collection: 'booking'
});

bookingSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});
var booking = mongoose.model('booking', bookingSchema);

module.exports = {
    booking
};