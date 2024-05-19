const express = require("express");
const router = express.Router();
const fetchUser = require("./middleware/fetchUser");

const User = require("../model/user");

router.get("/", fetchUser, async (req, res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  try {
    let address = user.address;

    res.render("address.pug", {
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
    let address = user.address;

    address.push({
      add: req.body.address,
      dist: req.body.district,
      state: req.body.state,
      pin: req.body.pincode,
    });
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
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
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
