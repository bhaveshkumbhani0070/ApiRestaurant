const mongoose = require('mongoose');
var Schema = mongoose.Schema;


// cust_review
var reviewSchema = new Schema({
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
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    },
    stars: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, {
    collection: 'cust_review'
});

reviewSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});

var cust_review = mongoose.model('cust_review', reviewSchema);
module.exports = {
    cust_review
};