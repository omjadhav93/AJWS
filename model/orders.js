var mongoose = require("mongoose");


var orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },

    'model-number': {
        type: String,
        required: true
    },

    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    quantity: {
        type: Number,
        required: true,
        default: 1
    },

    status: {
        type: String,
        default: "In Progress"
    }
})

module.exports = mongoose.model("Order",orderSchema);