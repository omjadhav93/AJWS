const fs = require('fs-extra');
const express = require("express");
const path = require("path");
const router = express();
const multer = require("multer");
const { default: mongoose } = require("mongoose");
const fetchUser = require("./middleware/fetchUser");
const fetchCheckAuth = require("./middleware/fetchCheckAuth");

const User = require("../model/user");
const { Brand } = require("../model/home")

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/productImg/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/brands', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        const brands = await Brand.find().sort({ updatedAt: -1 }).exec();

        if (user) {
            res.render('brands', { LoggedIn: 1, Seller: user.seller, brands });
        } else {
            res.render('brands', { brands });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching brands', error });
    }
});


router.post('/brands', fetchUser, upload.single('logo'), async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        if (!user) {
          // Clear the auth token cookie
          res.clearCookie('authtoken');
          req.session.returnTo = req.originalUrl;
          res.redirect("/auth/login");
    }

        if (!user.seller) {
            return res.status(200).send("You are not autherized to add brands.");
        }

        const { name, description, origin, categories } = req.body;
        const logoUrl = req.file ? req.file.path : null;

        // Validate required fields
        if (!logoUrl || !name || !description || !origin || !categories) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let oldBrand = await Brand.find({ name: name });
        oldBrand.forEach(brand => {
            let path = brand.logoUrl;
            // Delete the file like normal
            fs.unlink(path, (err) => {
                if (err) console.log(err);
                return;
            });
        })

        await Brand.deleteMany({ name: name.trim() });

        const newBrand = new Brand({
            logoUrl,
            name: name.trim(),
            description,
            origin,
            categories: categories.split(',') // Assuming categories are sent as a comma-separated string
        });

        await newBrand.save();
        res.status(201).redirect("/brands");
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error saving brand', error });
    }
});

router.post("/brands/delete", fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        if (!user) {
          // Clear the auth token cookie
          res.clearCookie('authtoken');
          req.session.returnTo = req.originalUrl;
          res.redirect("/auth/login");
    }
        
        if (!user.seller) {
            return res.status(200).send("You are not autherized to delete brands.");
        }

        const brandId = req.body.brandId;
        let oldBrand = await Brand.findById(brandId);
        let path = oldBrand.logoUrl;
        // Delete the file like normal
        fs.unlink(path, (err) => {
            if (err) console.log(err);
            return;
        });

        await Brand.findByIdAndDelete(brandId);

        res.status(201).redirect("/brands");
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error saving brand', error });
    }
})

module.exports = router;