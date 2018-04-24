const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// menu_items
var menu_itemsSchema = new Schema({
    rest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rest_info',
        required: true
    },
    item_name: {
        type: String,
        required: true
    },
    item_catagory: {
        type: String,
        required: true
    },
    item_image: {
        type: String,
        required: true
    },
    item_description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    collection: 'menu_items'
});
menu_itemsSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});
var menu_items = mongoose.model('menu_items', menu_itemsSchema);

module.exports = {
    menu_items
};