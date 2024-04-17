const { Model } = require("mongoose");
const { default: mongoose, model } = require("mongoose");

let filterSchema = new mongoose.Schema({
    user_id: String,
    'model-number': String,
    'product-category' : String,
    'product-type' : String,
    'filter-type' : String,
    'filteration-method': [String],
    color : [String],
    'model-name' : String,
    'brand-name' : String,
    'included-components' : [String],
    'tank-capacity': Number,
    material: String,
    stages: Number,
    waranty: Boolean,
    'waranty-count': String,
    originalPrice: Number,
    discount: Number,
    image: [Object],
    available: Boolean,
    rating: [Number],
    'buyers-count': Number,
    'visiter-count': Number,
    'rating-list': [Object]
    // {rater,rating}
});

let WaterFilter = mongoose.model('WaterFilter',filterSchema);

module.exports = WaterFilter;