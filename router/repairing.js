const express = require("express");
const router = express.Router();
const fetchCheckAuth = require("./middleware/fetchCheckAuth");
const mongoose = require('mongoose')

const User = require("../model/user");

router.get("/", fetchCheckAuth, async (req, res) => {
  let userId = (req.user != null)?req.user.id:new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
  const user = await User.findById(userId).select("-password");
  try {
    if (user) {
      res.render("repair.pug", { user: user});
    } else {
      res.render("repair.pug");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", (req, res) => {
  try {
    let service = req.body["service-type"];
    let fiterType = req.body["filter-type"];
    let buyerName = req.body.name;
    let buyerAddress = req.body.address;
    let buyerPincode = req.body.pincode;
    let buyerNumber = req.body.phone;
    let link = `https://wa.me/917387227775?text=Hello, There is a problem with our filter as described below:%0a
    Problem : ${service}%0a
    Filter Type : ${fiterType}%0a
    %20%20%20%20*Customer Details*%0a
    Customer Name : ${buyerName}%0a
    Address : ${buyerAddress}%0a
    Pincode : ${buyerPincode}%0a
    Phone No. : ${buyerNumber}`;
    res.redirect(`${link}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
