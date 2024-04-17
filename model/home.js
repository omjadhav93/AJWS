// importing modules
var mongoose = require('mongoose');

// Creating Schema
var cardSchema = new mongoose.Schema({
    'card-no' : Number,
    title: String,
    image : String,
    desc : String,
    'locate-to' : String,
    location : String
})

var categorySchema = new mongoose.Schema({
    'card-no' : Number,
    title : String,
    image: String
})

var brandSchema = new mongoose.Schema({
    'card-no' : Number,
    title : String,
    image: String
})

let card = mongoose.model("Card", cardSchema);
let category = mongoose.model("Category", categorySchema);
let brands = mongoose.model("Brand",brandSchema)

// export cartSchema
module.exports = {card,category,brands};