const express = require("express");
const router = express.Router();
const fetchCheckUser = require("./middleware/fetchCheckAuth")
const fetchUser = require("./middleware/fetchUser")
const mongoose = require('mongoose')

const User = require("../model/user");
const { Favourite, CancleOrder } = require("../model/lists");
const Order = require("../model/orders");

const products = require("../model/waterfilterandpurifiers");

router.get("/product", fetchCheckUser, async (req, res) => {
  let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
  const user = await User.findById(userId).select("-password");
  try {
    const modelNo = req.query.modelNo;
    const productData = await products.findOne({ "model-number": modelNo });

    // Rendering Files
    if (user) {
      const favList = await Favourite.findOne({ user_id: userId });
      res.render("product.pug", {
        LoggedIn: 1, Seller: user.seller,
        data: productData,
        fav: favList ? (favList.modelNums.includes(modelNo)) : false
      });
    } else {
      res.render("product.pug", { data: productData });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/product/order", fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select('-password');
  try {
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }

    const modelNo = req.query['model-number'];
    const color = req.query.color;
    const productData = await products.findOne({ "model-number": modelNo });

    // Rendering Files
    res.render("order.pug", {
      LoggedIn: 1, Seller: user.seller,
      item: productData,
      color: color,
      user: user
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.post('/product/order', fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select('-password');
  try {
    // Save Order
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }

    if (req.body['save-address']) {
      let address = user.address;
      let newAddress = {
        add: req.body['address-2'].length ? (req.body['address-1'] + ', ' + req.body['address-2']) : req.body['address-1'],
        dist: req.body.district,
        state: req.body.state,
        pin: req.body.pincode,
      };

      // Normalize the address for comparison (you can customize this based on your needs)
      let newAddressStr = `${newAddress.add}, ${newAddress.dist}, ${newAddress.state}, ${newAddress.pin}`.toLowerCase();

      // Check if the address already exists
      let addressExists = address.some(addr => {
        let existingAddressStr = `${addr.add}, ${addr.dist}, ${addr.state}, ${addr.pin}`.toLowerCase();
        return existingAddressStr === newAddressStr;
      });

      if (!addressExists) {
        // If the address does not exist, push the new address
        address.push(newAddress);
        user.address = address;
        await user.save();
      }
    }

    const modelNo = req.body.modelNo;
    const color = req.body.color;
    const product = await products.findOne({ "model-number": modelNo });
    const imageArr = product.image;
    const imageLocArrFinder = imageArr.find(item => item.hasOwnProperty(`${color}-image`));
    const imageLocArr = imageLocArrFinder ? imageLocArrFinder[`${color}-image`] : undefined;

    const newOrder = new Order({
      user_id: userId,
      'model-number': modelNo,
      'recevier-name': req.body.name,
      'recevier-phone': req.body.phone,
      color: color,
      image: imageLocArr[0],
      address: {
        add: req.body['address-2'].length ? (req.body['address-1'] + ', ' + req.body['address-2']) : req.body['address-1'],
        dist: req.body.district,
        state: req.body.state,
        pin: req.body.pincode,
      },
      quantity: req.body.quantity,
      payStatus: "Cash On Delivery",
    })

    newOrder.save().then(() => {
      res.status(200).redirect(`/order/status?orderId=${newOrder.orderId}`);
    }).catch((err) => {
      res.status(400).send(err);
    })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/order/status', fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select('-password');
  try {
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }

    const orderId = req.query.orderId.toString();
    const order = await Order.findOne({user_id: userId, orderId: orderId});
    const modelNo = order['model-number'];
    const color = order.color;
    const product = await products.findOne({ "model-number": modelNo });
    const imageArr = product.image;
    const imageLocArrFinder = imageArr.find(item => item.hasOwnProperty(`${color}-image`));
    const imageLocArr = imageLocArrFinder ? imageLocArrFinder[`${color}-image`] : undefined;

    res.status(200).render('orderStatus',{
      LoggedIn: 1,
      Seller: user.seller,
      order: order,
      images: imageLocArr
    })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/order/seller', fetchUser, async (req,res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select('-password');
  try {
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }

    if(!user.seller){
      return res.status(200).send("You are not autherized to access orders list!");
    }

    const orders = await Order.find().sort({ orderDate: -1 }).exec();

    res.status(200).render('orderSeller',{LoggedIn: 1, Seller: user.seller, orders: orders});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.post('/order/cancle', fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select('-password');
  try {
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }

    const orderId = req.body.orderId;
    const order = await Order.findOne({orderId: orderId});
    
    if(user._id != order.user_id){
      return res.status(200).send("You are not autherized to access this order!");
    }

    
    const reason = req.body.reason;
    const description = req.body.description;

    const cancleOrder = new CancleOrder({
      user_id: order.user_id,
      orderId: order.orderId,
      reason: reason,
      description: description
    })

    order.orderStage = 0;

    await cancleOrder.save();
    await order.save();

    res.status(200).redirect('/user/profile');
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
