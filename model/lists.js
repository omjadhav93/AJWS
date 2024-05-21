// importing modules
var mongoose = require('mongoose');

// Creating Schema
var favSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },

    modelNums : {
        type: [String],
        required: true,
        default: []
    }
})

let Favourite = mongoose.model("Favourite", favSchema);

module.exports = { Favourite };