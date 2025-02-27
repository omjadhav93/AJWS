const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const fetchUser = require("./middleware/fetchUser")

const User = require("../model/user");
const Order = require("../model/orders");
const Product = require("../model/waterfilterandpurifiers");

async function dataList(orders) {
    let data = [];
    let removeIndex = [];
    let included = []
    for (let i = 0; i < orders.length; i++) {
        let model = orders[i]['model-number'];
        if (!included.includes(model)) {
            let product = await Product.findOne({ "model-number": model });
            if (product == null) {
                removeIndex.push(i);
            } else {
                data.push(product);
                included.push(model);
            }
        }
    }
    return data;
}

router.get('/', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/login");
        }

        const orders = await Order.find({ user_id: userId, orderStage: 5 }).sort({ orderDate: -1 }).exec();
        const data = await dataList(orders);

        res.status(200).render("buyAgain", {
            LoggedIn: 1,
            Seller: user.seller,
            data
        })
    } catch (error) {

    }
})

module.exports = router;