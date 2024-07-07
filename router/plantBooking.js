const express = require("express");
const router = express.Router();
const fetchUser = require("./middleware/fetchUser");

const User = require("../model/user");
const { PlantBooking } = require("../model/lists");

router.get("/plant-booking", fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/auth/login");
        }

        
        if(user.seller){
            const bookings = await PlantBooking.find().sort({createdAt: -1}).exec();
            return res.status(200).render("plantBooking",{
                LoggedIn: 1,
                Seller: user.seller,
                prevBookings: bookings
            })
        }
        
        const prevBookings = await PlantBooking.find({user_id: userId}).sort({createdAt: -1}).exec();
        const msg = req.query.msg;

        if(msg){
            res.status(200).render("plantBooking",{
                LoggedIn: 1,
                Seller: user.seller,
                prevBookings,
                msg
            })
        }else{
            res.status(200).render("plantBooking",{
                LoggedIn: 1,
                Seller: user.seller,
                prevBookings
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/booking-request", fetchUser, async (req,res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/auth/login");
        }

        const { name, phone, whatsapp, requirement } = req.body;

        const prevBookings = await Repair.find({user_id: userId});
        let check = true;
        prevBookings.forEach(booking => {
            if(!booking.reviewed && booking.user_name == name.trim()){
                check = false;
            }
        })

        if(check){
            const newBooking = new PlantBooking({
                user_id: userId,
                user_name: name.trim(),
                user_phone: phone,
                user_whatsapp: whatsapp,
                requirement: requirement
            });

            newBooking.save().then(() => {
                res.status(200).redirect("/plant-booking?msg=Your request has been placed successfully. Our agents will contact you shortly.")
            }).catch((err) => {
                res.status(200).redirect(`/plant-booking?msg=Error occurs: ${err}. Try Again!`)
            });
        }else{
            res.status(200).redirect("/plant-booking?msg=You have already placed a request which is under review now. Our agents are contacting you, please wait. ")
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/plant-booking/reviewed', fetchUser, async (req,res) => {
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

        await PlantBooking.findByIdAndUpdate(Id, {reviewed: true});
        
        res.status(200).redirect("/plant-booking");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;