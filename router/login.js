const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");

const User = require('../model/user')
const Otp = require('../model/otp');
const { sendingMail } = require("../nodemailer/mailing");
const checkAuth = require('./middleware/checkAuth');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

function generateOTP() {
    return crypto.randomInt(100000, 999999);
}

router.get('/', checkAuth, (req, res) => {
    res.render('login')
})

// Password Login -----------------------------------------------------------------------------------

router.post('/', checkAuth, [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("login", { message: errors.array()[0], otherDetails: req.body});
    }

    try {
        let user = await User.findOne({ email: req.body.email }).select('+password')
        if (!user) {
            return res.status(400).render("login",{message: {msg: "User doesn't exists.",path:"email"}, otherDetails: req.body})
        }

        if (user && !user.isVerified) {
            await Otp.deleteMany({ userId: checkUser._id });
            await User.findByIdAndDelete(checkUser._id);
            return res.status(400).json({ success: false, msg: "User doesn't exists." });
        }
        
        let hash = user.password
        
        const result = await bcrypt.compare(req.body.password, hash)
        
        if (!result) {
            return res.status(400).render("login",{message: {msg: "Wrong Password!",path: "password"}, otherDetails: req.body})
        }
        
        const data = {
            user: {
                id: user.id
            }
        }
        
        const authtoken = jwt.sign(data, JWT_SECRET);
        // res.cookie('authtoken', authtoken, { httpOnly: false, secure: process.env.TOKEN_HEADER_KEY == "user_token_header_key" });
        res.cookie('authtoken', authtoken);

        let returnTo = req.session.returnTo || null;
        delete req.session.returnTo;

        res.redirect(returnTo || '/');

    } catch (error) {
        console.log(error)
        res.status(500).render("login", {message: {msg: "Internal Server Error", path: "general"}, otherDetails: req.body });
    }
})

// OTP Login ---------------------------------------------------------------------------------------

router.post('/generate-otp', [
    body("email", "Enter a valid Email").isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0] });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "User doesn't exists." });
        }

        if (user && !user.isVerified) {
            await Otp.deleteMany({ userId: user._id });
            await User.findByIdAndDelete(user._id);
            return res.status(400).json({ success: false, msg: "User doesn't exists." });
        }

        await Otp.deleteMany({userId: user._id});

        const { email } = req.body;

        // OTP Geneartion
        const otpvalue = generateOTP();
        const newOtp = new Otp({
            userId: user._id,
            otp: otpvalue
        })

        const savedOtp = await newOtp.save();
        if (!savedOtp) {
            return User.findByIdAndDelete(user._id)
                .then(() => res.status(404).json({ success: false, msg: "Error to generate OTP for you, try again. " }))
                .catch((delErr) => res.status(404).json({ success: false, msg: "Error to generate OTP for you, try after 20 minutes. " }));
        }

        // Sending Email
        sendingMail({
            from: "no-reply@example.com",
            to: `${email}`,
            subject: "OTP For Email Verification",
            text: `Hello ${user.firstName},
Your One-Time Password (OTP) for verification is: ${otpvalue}
This OTP is valid for only 20 minutes. Please do not share it with anyone.

Enjoy your shopping with AJ Water Solutions.
Best regards,  
AJ WATER SOLUTIONS`
        });

        res.status(200).json({ success: true, msg: `OTP sent to ${email} .` });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

router.post('/validate-otp', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "User doesn't exists." });
        }

        if (user && !user.isVerified) {
            await Otp.deleteMany({ userId: checkUser._id });
            await User.findByIdAndDelete(checkUser._id);
            return res.status(400).json({ success: false, msg: "User doesn't exists." });
        }

        const otp = await Otp.findOne({ userId: user._id });
        if(!otp){
            return res.status(400).json({ success: false, msg: "Error while verifing otp, try again." });
        }
        if (otp.otp === Number(req.body.otp)) {
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
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

router.post('/resend-otp', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "User not registered correctly." });
        }

        if (user && !user.isVerified) {
            await Otp.deleteMany({ userId: checkUser._id });
            await User.findByIdAndDelete(checkUser._id);
            return res.status(400).json({ success: false, msg: "User doesn't exists." });
        }

        // Delete prev OTP
        await Otp.deleteMany({ userId: user._id });

        // OTP Geneartion
        const otpvalue = generateOTP();
        const newOtp = new Otp({
            userId: user._id,
            otp: otpvalue
        })

        const savedOtp = await newOtp.save();
        if (!savedOtp) {
            return User.findByIdAndDelete(user._id)
                .then(() => res.status(404).json({ success: false, msg: "Error to generate OTP for you, try again. " }))
                .catch((delErr) => res.status(404).json({ success: false, msg: "Error to generate OTP for you, try after 20 minutes. " }));
        }

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

        res.status(200).json({ success: true, msg: `OTP sent to ${user.email} .` });

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

module.exports = router;