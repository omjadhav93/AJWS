const express = require("express");
const router = express.Router();
const fetchUser = require("./middleware/fetchUser");

const User = require("../model/user");

const Cart = require("../model/cart");
const Product = require("../model/product");
const { WaterFilter, WaterFilterCabinet } = require("../model/productmodels/home&kitchenappliances");

async function dataList(modelList) {
    let data = [];
    let removeIndex = [];
    for (let i = 0; i < modelList.length; i++) {
        let model = modelList[i];
        let product = await Product.findOne({ model_number: model });
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

router.get("/cart", fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/login");
        }

        let userCart = await Cart.findOne({ user_id: user.id });

        if (!userCart) {
            let newCart = new Cart({
                user_id: user.id,
                modelList: []
            })
            await newCart.save().then(() => {
                userCart = newCart;
            }).catch((err) => {
                console.log(err);
                res.status(400).send("Something went wrong.");
            })
        }

        const modelList = userCart.modelList;
        const data = await dataList(modelList);

        res.render("cart.pug", { LoggedIn: 1, Seller: user.seller, data: data });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/cart', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/login");
        }

        let userCart = await Cart.findOne({ user_id: user.id });

        if (!userCart) {
            userCart = new Cart({
                user_id: user.id,
                modelList: []
            })
        }

        let modelNo = [req.body['model-number']];
        if (!userCart.modelList.includes(req.body['model-number'])) {
            userCart.modelList = modelNo.concat(userCart.modelList);
        }

        await userCart.save();

        res.redirect(`/product?modelNo=${req.body["model-number"]}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/cart/remove', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            return res.redirect("/login");
        }

        let userCart = await Cart.findOne({ user_id: user.id });

        if(!userCart){
            userCart = new Cart({
                user_id: user.id,
                modelList: []
            })

            await userCart.save();
            return res.redirect("/user/cart");
        }

        let modelNo = req.body['model-number'];
        if(userCart.modelList.includes(modelNo)){
            userCart.modelList = userCart.modelList.filter(num => num !== modelNo);
            await userCart.save();
        }

        res.redirect(`/user/cart`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router