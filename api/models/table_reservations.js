const mongoose = require('mongoose');
var Schema = mongoose.Schema;


// table_reservations
var table_reservationsSchema = new Schema({
    cust_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    seats: {
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
    collection: 'table_reservations'
});

table_reservationsSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});

var table_reservations = mongoose.model('table_reservations', table_reservationsSchema);
module.exports = {
    table_reservations
};