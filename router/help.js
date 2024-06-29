const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const fetchUser = require("./middleware/fetchUser")

const User = require("../model/user");
const { Help } = require("../model/lists")

router.get('/', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/auth/login");
        }

        if (user.seller) {
            const Helps = await Help.find().sort({ createdAt: -1 }).exec();
            return res.status(200).render("help", {
                LoggedIn: 1,
                Seller: user.seller,
                pastHelps: Helps
            })
        }

        const pastHelps = await Help.find({ user_id: userId });
        const msg = req.query.msg;

        if (msg) {
            res.status(200).render("help", {
                LoggedIn: 1,
                Seller: user.seller,
                pastHelps,
                msg
            })
        } else {
            res.status(200).render("help", {
                LoggedIn: 1,
                Seller: user.seller,
                pastHelps
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/', fetchUser, async (req, res) => {
    // Handle validation errors
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/auth/login");
        }

        const { name, email, phone, problemType, description } = req.body;
        let orderNumber = 0;
        if (problemType == 'Order') {
            orderNumber = req.body.orderNumber
        }

        if (!name || !email || !phone || !description) {
            return res.status(200).send("You have to fill all the fields.")
        }

        // Create a new help document
        const newHelp = new Help({
            user_id: userId,
            user_name: name,
            user_email: email,
            user_phone: phone,
            problem_type: { problemType, orderNumber },
            description,
            reviewed: false
        });

        // Save the help document to the database
        newHelp.save().then(() => {
            res.status(200).redirect("/help?msg=Your problem is added successfully. Our agents will solved it shortly.")
        }).catch((err) => {
            res.status(200).redirect(`/help?msg=Error occurs: ${err}. Try Again!`)
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
});

router.post('/reviewed', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/auth/login");
        }

        if (!user.seller) {
            return res.status(200).send("You are not autherized to make changes!");
        }

        const { Id } = req.body;

        await Help.findByIdAndUpdate(Id, { reviewed: true });

        res.status(200).redirect("/help");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;