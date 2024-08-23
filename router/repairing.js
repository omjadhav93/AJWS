const express = require("express");
const router = express.Router();
const fetchUser = require("./middleware/fetchUser");
const mongoose = require('mongoose')

const User = require("../model/user");
const { Repair } = require("../model/lists")

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

    if (user.seller) {
      const bookings = await Repair.find().sort({ createdAt: -1 }).exec();
      return res.status(200).render("repair", {
        LoggedIn: 1,
        Seller: user.seller,
        prevBookings: bookings
      })
    }

    const prevBookings = await Repair.find({ user_id: userId }).sort({ createdAt: -1 }).exec();
    const msg = req.query.msg;

    if (msg) {
      res.status(200).render("repair", {
        LoggedIn: 1,
        Seller: user.seller,
        user: user,
        prevBookings,
        msg
      })
    } else {
      res.status(200).render("repair", {
        LoggedIn: 1,
        Seller: user.seller,
        user: user,
        prevBookings
      })
    }
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

    const { productCategory, productType, boughtFrom, modelNo, brandName, name, phone } = req.body;

    const prevBookings = await Repair.find({ user_id: userId });
    let check = true;
    prevBookings.forEach(booking => {
      if (!booking.reviewed && booking.customer_name == name.trim()) {
        check = false;
      }
    })

    if (check) {
      const newBooking = new Repair({
        user_id: userId,
        customer_name: name.trim(),
        customer_phone: phone,
        customer_address: {
          add: req.body['address-2'].length ? (req.body['address-1'] + ', ' + req.body['address-2']) : req.body['address-1'],
          dist: req.body.district,
          state: req.body.state,
          pin: req.body.pincode,
        },
        product_category: productCategory,
        product_type: productType,
        model_number: modelNo,
        product_brand: brandName,
        our_customer: boughtFrom,
      });

      newBooking.save().then(() => {
        res.status(200).redirect("/repair?msg=Your request has been placed successfully. Our agents will contact you shortly.")
      }).catch((err) => {
        res.status(200).redirect(`/repair?msg=Error occurs: ${err}. Try Again!`)
      });
    } else {
      res.status(200).redirect("/repair?msg=You have already placed a request which is under review now. Our agents are contacting you, please wait. ")
    }


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.post('/reviewed', fetchUser, async (req,res) => {
  let userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  try {
      if (!user) {
          // Clear the auth token cookie
          res.clearCookie('authtoken');
          req.session.returnTo = req.originalUrl;
          res.redirect("/auth/login");
      }

      if (!user.seller) {
          return res.status(200).send("You are not autherized to make changes!");
      }

      const { Id } = req.body;

      await Repair.findByIdAndUpdate(Id, {reviewed: true});
      
      res.status(200).redirect("/repair");
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
