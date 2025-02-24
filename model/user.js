var mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    line1: { type: String, trim: true },
    line2: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pin: { type: String, trim: true, match: [/^\d{6}$/, 'Pin code must be 6 digits'] },
});

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    phone: {
        type: String,
        match: /^\d{10}$/,
        trim: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    seller: {
        type: Boolean,
        default: false
    },

    address: {
        type: [addressSchema],
        default: [],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);