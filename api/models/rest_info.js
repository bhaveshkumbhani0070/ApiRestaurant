const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// rest_info
var rest_infoSchema = new Schema({
    rest_name: {
        type: String,
        required: true
    },
    rest_address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
        default: 'surat'
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_at: {
        type: Date,
        default: new Date()
    }
}, {
    collection: 'rest_info'
});

rest_infoSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});

var rest_info = mongoose.model('rest_info', rest_infoSchema);
module.exports = {
    rest_info
};