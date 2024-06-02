// importing modules
var mongoose = require('mongoose');
const orders = require('./orders');

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

var cancleOrderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },

    orderId: {
        type: String,
        ref: 'orders',
        required: true,
    },

    reason: {
        type: String,
        required: true
    },

    description: {
        type: String
    }
}, {
    timestamps: true
})

var plantBookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },

    user_name: {
        type: String,
        required: true,
        minlength: 3, // Minimum length for the name
        maxlength: 255, // Maximum length for the name
        trim: true // Trims whitespace from the beginning and end of the name
    },

    user_phone: {
        type: String,
        match: /^\d{10}$/, // Matches 10-digit phone numbers
        trim: true // Trims whitespace from the beginning and end of the phone number
    },

    user_whatsapp: {
        type: String,
        match: /^\d{10}$/, // Matches 10-digit phone numbers
        trim: true // Trims whitespace from the beginning and end of the phone number
    },

    requirement: {
        type: String
    },

    reviewed: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

var helpSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },

    user_name: {
        type: String,
        required: true,
        minlength: 3, // Minimum length for the name
        maxlength: 255, // Maximum length for the name
        trim: true // Trims whitespace from the beginning and end of the name
    },

    user_email: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },

    user_phone: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: /^\d{10}$/, // Matches 10-digit phone numbers
        trim: true // Trims whitespace from the beginning and end of the phone number
    },

    problem_type: {
        type: Object,
        required: true
    },

    description: {
        type: String
    },

    reviewed: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

let Favourite = mongoose.model("Favourite", favSchema);
let CancleOrder = mongoose.model("CancleOrder",cancleOrderSchema);
let PlantBooking = mongoose.model("PlantBookings",plantBookingSchema);
let Help = mongoose.model("Help",helpSchema)

module.exports = { Favourite, CancleOrder, PlantBooking, Help };