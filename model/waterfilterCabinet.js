const { Model } = require("mongoose");
const { default: mongoose, model } = require("mongoose");

let cabinetSchema = new mongoose.Schema({
    user_id: String,
    'model-number': String,
    'product-category' : String,
    'product-type' : String,
    'filter-part' : String,
    color : [String],
    'model-name' : String,
    'brand-name' : String,
    'tank-full-indicator' : String,
    'tank-capacity': Number,
    material: String,
    waranty: Boolean,
    'waranty-count': String,
    originalPrice: Number,
    discount: Number,
    image: [Object],
    available: Boolean,
    'buyers-count': Number,
    'visiter-count': Number,
    'rating-list': [Object],
    'raters-list': [Object]
});

let WaterFilterCabinet = mongoose.model('WaterFilterCabinet',cabinetSchema);

module.exports = WaterFilterCabinet;