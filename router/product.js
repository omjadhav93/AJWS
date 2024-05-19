const express = require("express");
const router = express.Router();
const fetchCheckUser = require("./middleware/fetchCheckAuth")
const mongoose = require('mongoose')

const User = require("../model/user");

const products = require("../model/waterfilterandpurifiers");

router.get("/product", fetchCheckUser, async (req, res) => {
  let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
  const user = await User.findById(userId).select("-password");
  try {
    const modelNo = req.query.modelNo;
    const productData = await products.findOne({ "model-number": modelNo });

    // Rendering Files
    if (user) {
      res.render("product.pug", {
        LoggedIn: 1,
        data: productData,
      });
    } else {
      res.render("product.pug", { data: productData });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/product/order", fetchCheckUser, async (req, res) => {
  let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
  const user = await User.findById(userId).select({password: 0, 'security-question': 0, 'security-ans': 0});
  try {
    const modelNo = req.query['model-number'];
    const color = req.query.color;
    const productData = await products.findOne({ "model-number": modelNo });

    // Rendering Files
    if (user) {
      res.render("order.pug", {
        LoggedIn: 1,
        item: productData,
        color: color,
        user: user
      });
    } else {
      res.render("order.pug", { item: productData, color: color });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})



module.exports = router;
