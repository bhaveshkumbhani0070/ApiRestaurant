const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// take_order
var orderSchema = new Schema({
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
    collection: 'take_order'
});

orderSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});

var take_order = mongoose.model('tack_order', orderSchema);

module.exports = { take_order };