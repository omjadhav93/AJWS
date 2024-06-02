const fs = require('fs-extra');
const express = require("express");
const path = require("path");
const router = express();
const multer = require("multer");
const { default: mongoose } = require("mongoose");
const fetchUser = require("./middleware/fetchUser");

const User = require("../model/user");

// Storage & filename setting
let Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "static/productImg/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
    },
});

let upload = multer({
    storage: Storage,
});

let uploadMultiple = upload.fields([
    { name: "Black-image", maxCount: 5 },
    { name: "White-image", maxCount: 5 },
    { name: "Gray-image", maxCount: 5 },
    { name: "Navy-image", maxCount: 5 },
    { name: "Royal-blue-image", maxCount: 5 },
    { name: "Light-blue-image", maxCount: 5 },
    { name: "Red-image", maxCount: 5 },
    { name: "Burgundy-image", maxCount: 5 },
    { name: "Pink-image", maxCount: 5 },
    { name: "Magenta-image", maxCount: 5 },
    { name: "Purple-image", maxCount: 5 },
    { name: "Lavender-image", maxCount: 5 },
    { name: "Green-image", maxCount: 5 },
    { name: "Lime-green-image", maxCount: 5 },
    { name: "Olive-green-image", maxCount: 5 },
    { name: "Yellow-image", maxCount: 5 },
    { name: "Gold-image", maxCount: 5 },
    { name: "Orange-image", maxCount: 5 },
    { name: "Brown-image", maxCount: 5 },
    { name: "Tan-image", maxCount: 5 },
    { name: "Silver-image", maxCount: 5 },
]);

router.get('/add-product', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        if (!user) {
            // Clear the auth token cookie
            res.clearCookie('authtoken');
            req.session.returnTo = req.originalUrl;
            res.redirect("/auth/login");
        }
        if (user.seller) {
            res.render("addProduct", { LoggedIn: 1, Seller: user.seller });
        } else {
            return res.status(400).send("You are not autherized to add products.");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

router.post("/add-product", fetchUser, uploadMultiple, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        if (!user) {
            req.session.returnTo = req.originalUrl;
            return res.redirect("/auth/login");
        }
        if (user.seller) {
            let imageArray = [];
            for (const key in req.files) {
                let fileNameArray = [];
                req.files[key].forEach((image) => {
                    fileNameArray.push(image.filename);
                });
                imageArray.push({ [key]: fileNameArray });
            }

            if (req.body["product-type"] == "Water Filter and Purifiers") {
                const WaterFilter = require("../model/waterfilterandpurifiers");
                let waterFilter = new WaterFilter({
                    user_id: user.id,
                    "model-number": "WF" + req.body["brand-name"].slice(0, 4) + Date.now().toString().slice(4, 10),
                    "product-category": req.body["product-category"],
                    "product-type": req.body["product-type"],
                    "filter-type": req.body["filter-type"],
                    "filteration-method": req.body["filteration-method"],
                    color: req.body.color,
                    "model-name": req.body["model-name"],
                    "brand-name": req.body["brand-name"],
                    "included-components": req.body["included-components"],
                    "tank-capacity": req.body["tank-capacity"],
                    stages: req.body["filteration-stages"],
                    material: req.body.material,
                    warranty: (req.body["warranty-count"] > 0 ? 1 : 0),
                    "warranty-count": req.body["warranty-count"],
                    originalPrice: req.body.price,
                    discount: req.body.discount,
                    image: imageArray,
                    available: true,
                    'buyers-count': 10,
                    'visiter-count': 50,
                    'rating-list': {
                        overall: req.body['overall-rating'],
                        design: req.body['design-rating'],
                        quality: req.body['quality-rating'],
                        durability: req.body['durability-rating'],
                        costvalue: req.body['costvalue-rating']
                    },
                    'raters-list': [{
                        rater: 'Seller',
                        rating: req.body['overall-rating']
                    }]
                })

                waterFilter.save().then(() => {
                    res.redirect("user/profile");
                }).catch((err) => {
                    res.status(404).send("Error to save : " + err);
                })
            } else if (
                req.body["product-type"] == "Water Filter Appliances" &&
                req.body["filter-part"] == "Cabinet"
            ) {
                const WaterFilterCabinet = require("../model/waterfilterCabinet");
                let waterFilterCabinet = new WaterFilterCabinet({
                    user_id: req.user.id,
                    "model-number":
                        "WFCAB" +
                        req.body["brand-name"].slice(0, 4) +
                        Date.now().toString().slice(4, 10),
                    "product-category": req.body["product-category"],
                    "product-type": req.body["product-type"],
                    "filter-part": req.body["filter-part"],
                    "tank-full-indicator": req.body["tank-full-indicator"],
                    color: req.body.color,
                    "model-name": req.body["model-name"],
                    "brand-name": req.body["brand-name"],
                    "tank-capacity": req.body["tank-capacity"],
                    material: req.body.material,
                    warranty: (req.body["warranty-count"] > 0 ? 1 : 0),
                    "warranty-count": req.body["warranty-count"],
                    originalPrice: req.body.price,
                    discount: req.body.discount,
                    image: imageArray,
                    available: true,
                    'buyers-count': 10,
                    'visiter-count': 50,
                    'rating-list': {
                        overall: req.body['overall-rating'],
                        design: req.body['design-rating'],
                        quality: req.body['quality-rating'],
                        durability: req.body['durability-rating'],
                        costvalue: req.body['costvalue-rating']
                    },
                    'raters-list': [{
                        rater: 'Seller',
                        rating: req.body['overall-rating']
                    }]
                });
                waterFilterCabinet.save().then(() => {
                    res.redirect("/user/profile");
                }).catch((err) => {
                    res.status(404).send("Error to save : " + err);
                });
            }

        } else {
            return res.status(400).send("You are not autherized to add products.");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

const products = require("../model/waterfilterandpurifiers");

router.post("/product/delete", fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        const itemId = req.body.itemId;
        const product = await products.findById(itemId);
        if (user.seller && user.id == product.user_id) {
            const imageArray = product.image;
            imageArray.forEach((img) => {
                let obj = Object.values(img)[0];
                obj.forEach(async (loc) => {
                    let path = "static/productImg/" + loc;
                    // Delete the file like normal
                    fs.unlink(path, (err) => {
                        if (err) console.log(err);
                        return;
                    });
                });
            });

            await products.findByIdAndDelete(itemId);
        }

        res.redirect("/user/profile");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/product/available', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        const itemId = req.body.itemId;
        const product = await products.findById(itemId);
        if (user.seller && user._id == product.user_id) {
            product.available = true;
            await product.save();
        }


        res.redirect("/user/profile");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/product/unavailable', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        const itemId = req.body.itemId;
        const product = await products.findById(itemId);
        if (user.seller && user._id == product.user_id) {
            product.available = false;
            await product.save();
        }

        res.redirect("/user/profile");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;