const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");

const User = require('../model/user')
const Otp = require('../model/otp');
const { SendOTP } = require('../nodemailer/sendotp');
const checkAuth = require('./middleware/checkAuth');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

router.get('/', checkAuth, (req, res) => {
    res.render('forgot', { section: "Email" })
})

router.get('/change-password', checkAuth, (req, res) => {
    res.render('forgot', { section: "Password" })
})

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

router.post('/validate-otp', [
    body("email", "Enter a valid Email").isEmail()
], async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, msg: "User doesn't exists." });
        }

        if (user && !user.isVerified) {
            await Otp.deleteMany({ userId: checkUser._id });
            await User.findByIdAndDelete(checkUser._id);
            return res.status(400).json({ success: false, msg: "User doesn't exists." });
        }

        const otp = await Otp.findOne({ userId: user._id });
        if (!otp) {
            return res.status(400).json({ success: false, msg: "Error while verifing otp, try again." });
        }

        if (otp.otp === Number(req.body.otp)) {
            await Otp.deleteMany({ userId: user._id })

            const verify = {
                user: {
                    id: user.id,
                    status: 'verified'
                }
            }
            
            const verifiedToken = jwt.sign(verify, JWT_SECRET);
            // res.cookie('verifiedToken', verifiedToken, { httpOnly: true, secure: process.env.TOKEN_HEADER_KEY == "user_token_header_key" });
            res.cookie('verifiedToken', verifiedToken);

            res.status(200).json({ success: true, msg: "User Verified.", returnTo: '/forgot/change-password' })
        } else {
            res.status(200).json({ success: false, msg: "Incorrect OTP!" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

router.post('/resend-otp', [
    body("email", "Enter a valid Email").isEmail()
], async (req, res) => {
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

router.post('/change-password', checkAuth, [
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
        })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("forgot", { section: "Password" , message: errors.array()[0]});
    }

    try {
        const verifiedToken = req.cookies.verifiedToken
        if (!verifiedToken) {
            return res.status(400).render("forgot", { section: "Email", message: {msg: "Your not verified to change password.",path:"general"} });
        }

        jwt.verify(verifiedToken, JWT_SECRET, async (err, decoded) => {
            if (err) {
                // Invalid token
                return res.status(400).render("forgot", { section: "Email", message: {msg: "Your verification got a Error!",path:"general"} });
            } else {
                // Valid token
                const verifyUser = decoded.user;
                if (verifyUser.status === "verified") {
                    let user = await User.findOne({ _id: verifyUser.id }).select('+password')
                    if (!user) {
                        return res.status(400).render("login",{ section: "Email" ,message: {msg: "User doesn't exists.",path: "general"}})
                    }
                    let password = req.body.password;
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(password, salt);
                    user.password = hash;
                    await user.save().then().catch((err) => {
                        res.status(400).send("Error to change password : " + err)
                    })
                    res.redirect("/login");
                }
            }
        });

    } catch (error) {
        console.log(error)
        res.status(500).render("login", {message: {msg: "Internal Server Error", path: "general"}});
    }
})

module.exports = router;