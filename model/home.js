// importing modules
var mongoose = require('mongoose');

// Creating Schema
var cardSchema = new mongoose.Schema({
    cardNo: Number,
    title: String,
    image: String,
    modelNo: String,
    desc: String,
    locateTo: String,
    location: String
})

var categorySchema = new mongoose.Schema({
    'card-no': Number,
    title: String,
    image: String
})

var brandSchema = new mongoose.Schema({
    logoUrl: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    origin: { type: String, required: true },
    categories: { type: [String], required: true },
}, {
    timestamps: true
});

let Card = mongoose.model("Card", cardSchema);
let Category = mongoose.model("Category", categorySchema);
let Brand = mongoose.model("Brand", brandSchema)

// export cartSchema
module.exports = { Card, Category, Brand };