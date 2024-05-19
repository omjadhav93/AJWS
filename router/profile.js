const express = require("express");
const router = express();
const fetchUser = require("./middleware/fetchUser");

const User = require("../model/user");

router.get('/user/profile',fetchUser,async (req,res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            req.session.returnTo = req.originalUrl;
            res.redirect("/login");
        }

        res.render("profile.pug",{LoggedIn: 1, user: user});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;