const mongoose = require('mongoose');
var Schema = mongoose.Schema;


// customers
var customersSchema = new Schema({
    rest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rest_info',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: 'customers'
});

customersSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});
var customers = mongoose.model('customers', customersSchema);

module.exports = {
    customers
};