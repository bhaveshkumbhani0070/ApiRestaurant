const mongoose = require('mongoose');
var Schema = mongoose.Schema;


// menu_categories
var menu_categoriesSchema = new Schema({
    rest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rest_info',
        required: true
    },
    category_name: {
        type: String,
        required: true
    }
}, {
    collection: 'menu_categories'
});

menu_categoriesSchema.index({
    "loc": "2dsphere",
    "destination": "2dsphere",
    "courier_loc": "2dsphere"
});
var menu_categories = mongoose.model('menu_categories', menu_categoriesSchema);

module.exports = {
    menu_categories
};