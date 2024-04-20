const express = require('express')
const router = express.Router()
const User = require('../model/user')
const Cart = require("../model/cart")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");
const checkAuth = require('./middleware/checkAuth')

const JWT_SECRET = process.env.JWT_SECRET_KEY;

router.get('/register',checkAuth, (req, res) => {
    res.render('register')
})

router.get('/login',checkAuth, (req, res) => {
    res.render('login')
})

router.get('/forgot',checkAuth, (req, res) => {
    res.render('forgot',{section: "Email"})
})

router.get('/forgot-Question',checkAuth, (req, res) => {
    res.render('forgot',{section: "Question",'question-type': req.query.question})
})

router.get('/change-password',checkAuth, (req, res) => {
    res.render('forgot',{section: "Password"})
})

router.post("/register",checkAuth, [
    body("name", "Enter a valid name ! It Should be atleast three characters.").isLength({ min: 3 }),
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
        })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).render("register", { message: errors.array()[0].msg });
        return res.send(errors)
    }

    try {
        // Check whether the user with these details exists or not.
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            // return res.status(400).render("register", { message: "User already exists with this email." })
            return res.send("User already exists with this email.")
        }

        const { name, email, phone, password } = req.body;

        // Creating Hash of password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user = new User({
            email: email,
            password: hash,
            name: name,
            phone: phone,
            'security-question': req.body['security-question'],
            'security-ans': req.body['security-ans'],
            seller: false,
            address: []
        })
        
        user.save().then().catch((err) => {
            res.status(404).send("Error to create User for you : " + err)
        })

        const data = {
            user: {
                id: user.id,
              },
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.cookie('authtoken', authtoken, { httpOnly: true ,secure: process.env.TOKEN_HEADER_KEY == "user_token_header_key" });

        // res.redirect(returnTo || '/');
        res.send("Success")

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }

})

router.post("/login",checkAuth,[
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists()
],async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).render("login", { message: errors.array()[0].msg });
        return res.send(errors)
    }

    try {
        let user = await User.findOne({email: req.body.email}).select('+password')
        if(!user){
            // return res.status(400).render("login",{message: "User doesn't exists."})
            return res.send("User doesn't exists.")
        }

        let hash = user.password

        const result  = await bcrypt.compare(req.body.password,hash)

        if(!result){
            // return res.status(400).render("login",{message: "Wrong Password!"})
            return res.send("Wrong Password!")
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.cookie('authtoken', authtoken, { httpOnly: true ,secure: process.env.TOKEN_HEADER_KEY == "user_token_header_key" });

        // res.redirect(returnTo || '/');
        res.send(authtoken)

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;