const express = require('express')
const router = express.Router()
const User = require('../model/user')
const Cart = require("../model/cart")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");
const checkAuth = require('./middleware/checkAuth');

const JWT_SECRET = process.env.JWT_SECRET_KEY;


router.get('/register', checkAuth, (req, res) => {
    res.render('register')
})

router.get('/login', checkAuth, (req, res) => {
    res.render('login')
})

router.get('/forgot', checkAuth, (req, res) => {
    res.render('forgot', { section: "Email" })
})

router.get('/forgot-question', checkAuth, (req, res) => {
    res.render('forgot', { section: "Question", questionType: req.query.question, email: req.query.email })
})

router.get('/change-password', checkAuth, (req, res) => {
    res.render('forgot', { section: "Password" })
})

router.post("/register", checkAuth, [
    body("first-name", "Enter a valid name ").isLength({ min: 2 }),
    body("last-name", "Enter a valid name ").isLength({ min: 2 }),
    body("security-question", "Select a question for security. ").isLength({ min: 2 }),
    body("security-ans", "Enter a valid answer.").isLength({ min: 2 }),
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
        return res.status(400).render("register", { message: errors.array()[0], otherDetails: req.body});
    }

    try {
        // Check whether the user with these details exists or not.
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).render("register", { message: {msg: "User already exists with this email.", path:"general"}, otherDetails: req.body })
        }

        const {email, phone, password } = req.body;
        const firstName = req.body['first-name'];
        const lastName = req.body['last-name'];
        const name = firstName + ' ' + lastName;

        // Creating Hash of password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const question = req.body['security-question'].trim();
        const answer = req.body['security-ans'].trim();
        user = new User({
            email: email,
            password: hash,
            name: name,
            phone: phone,
            'security-question': question,
            'security-ans': answer,
            seller: false,
            address: []
        })

        user.save().then().catch((err) => {
            return res.status(404).render("register", { message: {msg: "Error to create User for you : ", path:"general"}, otherDetails: req.body })
        })

        const data = {
            user: {
                id: user.id,
            },
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        // res.cookie('authtoken', authtoken, { httpOnly: true, secure: process.env.TOKEN_HEADER_KEY == "user_token_header_key" });
        res.cookie('authtoken', authtoken);

        let returnTo = req.session.returnTo || null;
        delete req.session.returnTo;

        res.redirect(returnTo || '/');

    } catch (error) {
        console.log(error)
        res.status(500).render("register", {message: {msg: "Internal Server Error", path: "general"}, otherDetails: req.body });
    }

})

router.post("/login", checkAuth, [
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

router.post("/forgot", checkAuth, [
    body("email", "Enter a valid Email").isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("forgot", { section: "Email" , message: errors.array()[0], otherDetails: req.body});
    }

    try {
        let user = await User.findOne({ email: req.body.email }).select('+security-question')
        if (!user) {
            return res.status(400).render("login",{ section: "Email" ,message: {msg: "User doesn't exists.",path: "general"}})
        }

        let question = user['security-question']

        res.redirect(`/auth/forgot-question?email=${user.email}&question=${question}`)

    } catch (error) {
        console.log(error)
        res.status(500).render("forgot", { section: "Email" , message: {msg: "Internal Server Error", path: "general"}, otherDetails: req.body });
    }
})

router.post("/forgot-question", checkAuth, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email }).select('+security-question +security-ans')
        if (!user) {
            return res.status(400).render("login",{ section: "Email" ,message: {msg: "User doesn't exists.",path: "general"}})
        }

        let answer = user['security-ans'];
        let userResponse = req.body.answer;
        if (answer.toUpperCase().trim() != userResponse.toUpperCase().trim()) {
            return res.render('forgot', { section: "Question", questionType: user['security-question'], email: req.body.email, message: {msg: "Wrong Answer!", path: "general"} })
        }

        const verify = {
            user: {
                id: user.id,
                status: 'verified'
            }
        }

        const verifiedToken = jwt.sign(verify, JWT_SECRET);
        // res.cookie('verifiedToken', verifiedToken, { httpOnly: true, secure: process.env.TOKEN_HEADER_KEY == "user_token_header_key" });
        res.cookie('verifiedToken', verifiedToken);

        res.redirect('/auth/change-password')

    } catch (error) {
        console.log(error)
        res.status(500).render('forgot', { section: "Email", message: {msg: "Internal Server Error", path: "general"}, otherDetails: req.body });
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
                        res.status(404).send("Error to change password : " + err)
                    })
                    res.redirect("/auth/login");
                }
            }
        });

    } catch (error) {
        console.log(error)
        res.status(500).render("login", {message: {msg: "Internal Server Error", path: "general"}});
    }
})

router.post("/logout", (req, res) => {
    try {
        // Clear the auth token cookie
        res.clearCookie('authtoken');
        
        // Redirect to login page or any other appropriate page
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;