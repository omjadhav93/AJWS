const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const fetchUser = require("./middleware/fetchUser")

const User = require("../model/user");
const Order = require("../model/orders");
const Product = require("../model/product");
const { WaterFilter, WaterFilterCabinet } = require("../model/productmodels/home&kitchenappliances");

async function dataList(orders) {
    let data = [];
    let removeIndex = [];
    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let product = await Product.findOne({ model_number: order['model-number'] });
        if (product == null) {
            removeIndex.push(i);
        } else {
            let productDetails;
            // Get the detailed product information based on product type
            if (product.product_type === "Water Filter and Purifiers") {
                productDetails = await WaterFilter.findById(product.product_details);
            } else if (product.product_type === "Water Filter Cabinet") {
                productDetails = await WaterFilterCabinet.findById(product.product_details);
            }
            
            // Extract _id from productDetails and keep other properties
            const { _id: detailsId, ...detailsWithoutId } = productDetails._doc;
            
            product = {
                ...product._doc,
                ...detailsWithoutId
            };
            
            data.push(product);
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
            data
        })
    } catch (error) {

    }
})

module.exports = router;