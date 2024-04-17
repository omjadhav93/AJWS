var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    user_id: String,
    'model-number': String,
    order_date: Number,
    quantity: Number,
    status: String
})

module.exports = mongoose.model("Order",orderSchema);