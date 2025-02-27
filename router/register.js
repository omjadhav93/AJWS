const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");

const User = require('../model/user');
const Otp = require('../model/otp');
const { SendOTP } = require('../nodemailer/sendotp');
const checkAuth = require('./middleware/checkAuth');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

router.get('/', checkAuth, (req, res) => {
    res.render('register')
})

router.post('/generate-otp', [
    body("first-name", "Enter a valid name ").isLength({ min: 2 }),
    body("last-name", "Enter a valid name ").isLength({ min: 2 }),
    body("email", "Enter a valid Email").isEmail(),
    body("phone").optional().matches(/^\d{10}$/).withMessage("Enter a valid 10-digit phone number"),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .custom(value => {
            if (!/[A-Z]/.test(value)) {
                throw new Error('Password must contain at least one uppercase letter');
            }
            if (!/[0-9]/.test(value)) {
                throw new Error('Password must contain at least one number');
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                throw new Error('Password must contain at least one special character');
            }
            return true;
        }),
    body("confirm")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0] });
    }

    try {
        const checkUser = await User.findOne({ email: req.body.email });
        if (checkUser && checkUser.isVerified) {
            return res.status(400).json({ success: false, msg: "User already exists with this email." });
        }

        if (checkUser && !checkUser.isVerified) {
            await Otp.deleteMany({ userId: checkUser._id });
            await User.findByIdAndDelete(checkUser._id);
        }

        const { email, phone, password } = req.body;
        const firstName = req.body['first-name'];
        const lastName = req.body['last-name'];

        // Creating Hash of password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            password: hash,
            firstName,
            lastName,
            phone,
        })

        const savedUser = await user.save();
        if (!savedUser) {
            return res.status(404).json({ success: false, msg: "Error to create User for you, try again. " })
        }

        const otpstatus = await SendOTP(user);
        if(!otpstatus){
            res.status(200).json({ success: false, msg: `Something went wrong, try again.` });
        }

        res.status(200).json({ success: true, msg: `OTP sent to ${email} .` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

router.post('/validate-otp',[
    body("email", "Enter a valid Email").isEmail()
], async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "User not registered correctly." });
        }

        const otp = await Otp.findOne({ userId: user._id });
        if (otp.otp === Number(req.body.otp)) {
            await User.findByIdAndUpdate(user._id, { isVerified: true });
            await Otp.deleteMany({ userId: user._id })
            // Create JWT Token
            const data = {
                user: {
                    id: user._id,
                },
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            // res.cookie('authtoken', authtoken, { httpOnly: true, secure: process.env.TOKEN_HEADER_KEY == "user_token_header_key" });
            res.cookie('authtoken', authtoken);

            let returnTo = req.session.returnTo || null;
            delete req.session.returnTo;

            res.status(200).json({ success: true, msg: "Login Success", returnTo: returnTo || '/' })
        } else {
            res.status(200).json({ success: false, msg: "Incorrect OTP!" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

router.post('/resend-otp',[
    body("email", "Enter a valid Email").isEmail()
], async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "User not registered correctly." });
        }

        if(user && user.isVerified) {
            return res.status(400).json({ success: false, msg: "User already verified, can't resend the OTP. Try Login User." });
        }

        const otpstatus = await SendOTP(user);
        if(!otpstatus){
            res.status(200).json({ success: false, msg: `Something went wrong, try again.` });
        }

        res.status(200).json({ success: true, msg: `OTP sent to ${user.email} .` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

// Delete otp from database after 20 minutes.
// Run cleanup every 10 minutes
cron.schedule("*/10 * * * *", async () => {
    try {
        const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000); // Get timestamp 20 min ago

        // Find OTPs that expired (createdAt older than 20 min)
        await Otp.deleteMany({ createdAt: { $lt: twentyMinutesAgo } });

        // Find unverified User and delete.
        await User.deleteMany({ createdAt: { $lt: twentyMinutesAgo }, isVerified: false });

    } catch (error) {
        console.error("Error in cleanup job:", error);
    }
});


module.exports = router;