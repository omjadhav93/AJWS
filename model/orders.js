var mongoose = require("mongoose");


var orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    
    orderId: {
        type: String,
        required: true,
        default: Date.now().toString().substr(-8)
    },

    'model-number': {
        type: String,
        required: true
    },
    
    'recevier-name': {
        type: String,
        required: true
    },

    'recevier-phone': {
        type: Number,
        required: true
    },
    
    image: {
        type: String,
        required: true
    },

    color: {
        type: String,
        required: true
    },

    address: {
        type: Object,
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

    payment: {
        type: Boolean,
        required: true,
        default: false
    },

    payStatus: {
        type: String,
        required: true
    },

    orderStage: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model("Order",orderSchema);