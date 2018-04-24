const mongoose = require('mongoose');
var Schema = mongoose.Schema;


// home_order
var home_orderSchema = new Schema({
    cust_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    time: {
        type: String,
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
    collection: 'home_order'
});

home_orderSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});

var home_order = mongoose.model('home_order', home_orderSchema);

module.exports = {
    home_order
};