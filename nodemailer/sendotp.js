const Otp = require('../model/otp');
const crypto = require("crypto");
const { sendingMail } = require("./mailing");

function generateOTP() {
    return crypto.randomInt(100000, 999999);
}

const SendOTP = async (user) => {
    await Otp.deleteMany({ userId: user._id });

    // OTP Geneartion
    const otpvalue = generateOTP();
    const newOtp = new Otp({
        userId: user._id,
        otp: otpvalue
    })

    const savedOtp = await newOtp.save();
    if(!savedOtp) return false;

    // Sending Email
    sendingMail({
        from: "no-reply@example.com",
        to: `${user.email}`,
        subject: "OTP For Email Verification",
        text: `Hello ${user.firstName},
Your One-Time Password (OTP) for verification is: ${otpvalue}
This OTP is valid for only 20 minutes. Please do not share it with anyone.

Enjoy your shopping with AJ Water Solutions.
Best regards,  
AJ WATER SOLUTIONS`
    });

    return true;
}

module.exports = {
    SendOTP
}