const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        otp: {
            type: Number,
            required: true,
            validate: {
                validator: (v) => v.toString().length === 6,
                message: "OTP must be exactly 6 digits"
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Otp", OtpSchema);