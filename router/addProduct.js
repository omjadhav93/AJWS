const fs = require('fs-extra');
const express = require("express");
const path = require("path");
const router = express();
const multer = require("multer");
const fetchUser = require("./middleware/fetchUser");
const Product = require("../model/product");
const { WaterFilter, WaterFilterCabinet } = require("../model/productmodels/home&kitchenappliances");
const { Brand } = require("../model/home");
const CustomerRating = require("../model/rating");

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
    { name: "Royalblue-image", maxCount: 5 },
    { name: "Lightblue-image", maxCount: 5 },
    { name: "Purple-image", maxCount: 5 },
    { name: "Violet-image", maxCount: 5 },
    { name: "Red-image", maxCount: 5 },
    { name: "Maroon-image", maxCount: 5 },
    { name: "Pink-image", maxCount: 5 },
    { name: "Magenta-image", maxCount: 5 },
    { name: "Lavender-image", maxCount: 5 },
    { name: "Green-image", maxCount: 5 },
    { name: "Limegreen-image", maxCount: 5 },
    { name: "Olivegreen-image", maxCount: 5 },
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
            res.redirect("/login");
        }
        const brands = await Brand.find().select('id name');
        if (user.seller) {
            res.render("addProduct", { LoggedIn: 1, Seller: user.seller, brands });
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
            return res.redirect("/login");
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

            
            let { product_category, product_type, model_name, brand_name, material, warranty, price, discount, color, overall, design, quality, durability, costvalue, ...details } = req.body;

            let obj;
            if (product_type === "Water Filter and Purifiers") {
                obj = new WaterFilter({ ...details });
            } else if (product_type === "Water Filter Cabinet") {
                obj = new WaterFilterCabinet({ ...details });
            }

            await obj.save();

            let product = new Product({
                seller_id: user.id,
                product_category,
                product_type,
                product_details: obj._id,
                model_name,
                brand_name,
                material,
                warranty,
                price,
                discount,
                color,
                image: imageArray,
                available: true,
            });

            await product.save();

            // Convert rating values to numbers
            const overallRating = parseFloat(overall) || 0;
            const designRating = parseFloat(design) || 0;
            const qualityRating = parseFloat(quality) || 0;
            const durabilityRating = parseFloat(durability) || 0;
            const costvalueRating = parseFloat(costvalue) || 0;
            
            // Create a CustomerRating entry for the seller's initial rating
            if (overallRating > 0) {
                const customerRating = new CustomerRating({
                    user_id: user.id,
                    product_id: product._id,
                    rating: {
                        overall: overallRating,
                        design: designRating,
                        quality: qualityRating,
                        durability: durabilityRating,
                        costvalue: costvalueRating
                    },
                    feedback: "Initial seller rating"
                });
                await customerRating.save();
                // The CustomerRating post-save hook will automatically update the Product's rating
            }

            res.redirect("/user/profile");

        } else {
            return res.status(400).send("You are not autherized to add products.");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/product/delete", fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        if (!user) {
            req.session.returnTo = req.originalUrl;
            return res.redirect("/login");
        }

        const { itemId } = req.body;
        const product = await Product.findById(itemId);
        if (!product || product.seller_id.toString() !== user.id) {
            return res.status(403).send("Unauthorized");
        }

        // Delete associated images
        product.image.forEach((img) => {
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

        // Delete specific product details
        if (product.product_type === "Water Filter") {
            await WaterFilter.findOneAndDelete({ product_id: itemId });
        } else if (product.product_type === "Water Filter Cabinet") {
            await WaterFilterCabinet.findOneAndDelete({ product_id: itemId });
        }

        // Delete product itself
        await Product.findByIdAndDelete(itemId);

        res.redirect("/user/profile");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/product/available', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try {
        const itemId = req.body.itemId;
        const product = await Product.findById(itemId);
        if (user.seller && user.id == product.seller_id) {
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
        const product = await Product.findById(itemId);
        if (user.seller && user.id == product.seller_id) {
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