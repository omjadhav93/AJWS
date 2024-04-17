// importing modules
var mongoose = require('mongoose');

// Creating Schema
var cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    modelList: [String]
})

// export cartSchema
module.exports = mongoose.model("Cart", cartSchema);