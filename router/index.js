const fs = require('fs-extra');
const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const fetchUser = require("./middleware/fetchUser")
const fetchCheckUser = require("./middleware/fetchCheckAuth")
const multer = require("multer")

const User = require("../model/user");
const { Card, Category, Brands } = require("../model/home")

async function dataFinder(compare) {
    let requireModel = require(`../model/product`);
    let data = await requireModel.find({ price: { $gte: compare } });
    return Array.isArray(data) ? data : [data]
}

/* Sorting Lists as per there number */
function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].cardNo < right[rightIndex].cardNo) {
            result.push(left[leftIndex]);
            leftIndex++;
        }else{
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }


    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function sequence(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
    
    return merge(sequence(left), sequence(right));
}

router.get("/", fetchCheckUser, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        let cardList = sequence(await Card.find());
        let categoryList = [] // sequence(await Category.find());
        let otherBrandList = [] // sequence(await Brands.find());
        if (user) {
            if (user.seller) {
                res.render("indexAdmin.pug", { LoggedIn: 1, Seller: user.seller, cardList, categoryList, otherBrandList })
            } else {
                res.render("index.pug", { LoggedIn: 1, Seller: user.seller, cardList, categoryList, otherBrandList })

            }
        } else {
            res.render("index.pug", { cardList, categoryList, otherBrandList })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

/* Saving Card Image & Details. */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/productImg/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.post("/saveCard", fetchUser, upload.single('cardImage'), async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
          // Clear the auth token cookie
          res.clearCookie('authtoken');
          req.session.returnTo = req.originalUrl;
          res.redirect("/login");
    }

        if (user.seller) {
            const cardNo = req.body.cardNo;
            const title = req.body.title;
            const image = req.file.filename;
            const modelNo = req.body.modelNo;
            const desc = req.body.desc;
            // const locateTo = req.body['locate-to'];
            // const location = req.body.location;

            let oldCard = await Card.find({ cardNo: cardNo });
            oldCard.forEach(card => {
                let path = "static/productImg/" + card.image;
                // Delete the file like normal
                fs.unlink(path, (err) => {
                    if (err) console.log(err);
                    return;
                });
            })

            await Card.deleteMany({cardNo: cardNo});

            let newCard = new Card({
                cardNo: cardNo,
                title: title,
                image: image,
                modelNo: modelNo,
                desc: desc
            })

            newCard.save().then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.status(404).send("Error to save : " + err);
            })
        }


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

/* Backend of cardSaver is done but edit place in not working now so it not tested yet.*/

module.exports = router;