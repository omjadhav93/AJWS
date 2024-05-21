// importing modules
var mongoose = require('mongoose');
  
  
var UserSchema = new mongoose.Schema({  
    name: {
        type: String,
        required: true,
        minlength: 3, // Minimum length for the name
        maxlength: 255, // Maximum length for the name
        trim: true // Trims whitespace from the beginning and end of the name
    },

    email: {
        type: String,
        required: true,
        unique: true, // Ensures uniqueness of email addresses
        lowercase: true, // Converts email addresses to lowercase before saving
        trim: true, // Trims whitespace from the beginning and end of email addresses
        validate: {
            validator: function(value) {
                // Using a simple regular expression for email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for the password
        select: false // Ensures that the password field is not returned by default in queries
    },
    
    phone: {
        type: String,
        match: /^\d{10}$/, // Matches 10-digit phone numbers
        trim: true // Trims whitespace from the beginning and end of the phone number
    },

    'security-question': {
        type: String,
        required: true,
        select: false // Ensures that the password field is not returned by default in queries
    },

    'security-ans': {
        type: String,
        required: true,
        select: false // Ensures that the password field is not returned by default in queries
    },
    seller: Boolean,
    address: [Object],
});
  
  
// export userschema
module.exports = mongoose.model("User", UserSchema);