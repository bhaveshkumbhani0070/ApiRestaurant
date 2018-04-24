const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// offer
var offerSchema = new Schema({
    rest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rest_info',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    collection: 'offer'
});

offerSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});
var offer = mongoose.model('offer', offerSchema);
module.exports = {
    offer
};