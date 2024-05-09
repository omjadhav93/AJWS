// importing modules
var mongoose = require('mongoose');

// Creating Schema
var cardSchema = new mongoose.Schema({
    cardNo : Number,
    title: String,
    image : String,
    desc : String,
    locateTo : String,
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

let Card = mongoose.model("Card", cardSchema);
let Category = mongoose.model("Category", categorySchema);
let Brands = mongoose.model("Brand",brandSchema)

// export cartSchema
module.exports = {Card, Category, Brands };