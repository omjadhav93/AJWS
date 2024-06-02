const express = require("express");
const router = express.Router();
const fetchUser = require("./middleware/fetchUser");

const User = require("../model/user");

const Cart = require("../model/cart");
const Product = require("../model/waterfilterandpurifiers");

async function dataList(modelList) {
    let data = [];
    let removeIndex = [];
    for (let i = 0; i < modelList.length; i++) {
      let model = modelList[i];
      let product = await Product.findOne({ "model-number": model });
      if (product == null) {
        removeIndex.push(i);
      } else data.push(product);
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
            res.redirect("/auth/login");
        }

        let userCart = await Cart.findOne({user_id: user.id});

        if(!userCart){
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

        res.render("cart.pug", { LoggedIn: 1, Seller: user.seller,data: data});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/cart',fetchUser, async (req,res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/auth/login");
        }

        let userCart = await Cart.findOne({user_id: user.id});

        if(!userCart){
            userCart = new Cart({
                user_id: user.id,
                modelList: []
            })
        }

        let modelNo = [req.body['model-number']];
        if(!userCart.modelList.includes(req.body['model-number'])){
            userCart.modelList = modelNo.concat(userCart.modelList);
        }

        await userCart.save();

        res.redirect(`/product?modelNo=${req.body["model-number"]}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/cart/remove',fetchUser, async (req,res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/auth/login");
        }

        let userCart = await Cart.findOne({user_id: user.id});

        if(!userCart){
            userCart = new Cart({
                user_id: user.id,
                modelList: []
            })
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