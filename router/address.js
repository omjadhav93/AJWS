const express = require("express");
const router = express.Router();
const fetchUser = require("./middleware/fetchUser");

const User = require("../model/user");

router.get("/", fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  try {
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }

    let address = user.address;

    res.render("address.pug", {
      LoggedIn: 1, Seller: user.seller,
      address: address,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  try {
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }

    let address = user.address;
    let newAddress = {
      line1: req.body['address-1'],
      line2: req.body['address-2'] || '',
      dist: req.body.district,
      state: req.body.state,
      pin: req.body.pincode,
    };

    let addressExists = user.address.some(addr => 
      Object.keys(newAddress).every(key => 
        addr[key]?.toLowerCase().trim() === newAddress[key]?.toLowerCase().trim()
      )
    );    

    if (addressExists) {
      return res.status(400).send("Address already exists");
    }

    // If the address does not exist, push the new address
    address.push(newAddress);
    user.address = address;
    user.save().then(() => {
      res.redirect("/user/address");
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/delete", fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  try {
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }

    let address = user.address;

    var index = req.body.index;
    if (index !== -1) {
      address.splice(index, 1);
    }
    user.address = address;
    user.save();
    res.redirect("/user/address");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/main", fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  try {
    if (!user) {
      // Clear the auth token cookie
        res.clearCookie('authtoken');
      req.session.returnTo = req.originalUrl;
      res.redirect("/auth/login");
    }
    
    let address = user.address;

    var index = req.body.index;
    if (index !== -1) {
      mainAddress = address[index];
      address.splice(index, 1);
    }
    address.unshift(mainAddress);
    user.address = address;
    user.save();
    res.redirect("/user/address");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
