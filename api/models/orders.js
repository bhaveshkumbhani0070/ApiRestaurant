const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// orders
var orderSchema = new Schema({
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
    details: {
        type: String,

    },
    cost: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    coupon: {
        type: String
    },
    pay_status: {
        type: String,
        required: true
    }
}, {
    collection: 'orders'
});

orderSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});

var orders = mongoose.model('orders', orderSchema);
module.exports = {
    orders
};