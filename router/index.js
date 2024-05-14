// const fs = require('fs-extra');
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
    let requireModel = require(`../model/waterfilterandpurifiers`);
    let data = await requireModel.find({ originalPrice: { $gte: compare } });
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

    const final = merge(sequence(left), sequence(right));
    return final;
}

/* Sorting As per frequency of buying. */
function freqMerge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex]['buyers-count'] == right[rightIndex]['buyers-count']) {
            if (left[leftIndex]['visiter-count'] < right[rightIndex]['visiter-count']) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        } else if (left[leftIndex]['buyers-count'] < right[rightIndex]['buyers-count']) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function freqSequence(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor((arr.length) / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);


    return freqMerge(freqSequence(left), freqSequence(right));
}

async function FreqPurchasedListFinder() {
    let data = await dataFinder(6000);
    data = freqSequence(data);
    return data.slice(0, 10);
}

/* Sorting as per Low Price. */
function priceMerge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].originalPrice < right[rightIndex].originalPrice) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function priceSequence(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return priceMerge(priceSequence(left), priceSequence(right));
}

async function lessPriceListFinder() {
    let data = await dataFinder(2500);
    data = priceSequence(data);
    return data.slice(0, 10);
}

/* Sorting as per design ratings. */
function designMerge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex]['rating-list'].design < right[rightIndex]['rating-list'].design) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function designSequence(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return designMerge(designSequence(left), designSequence(right));
}

async function TopInDesignsListFinder() {
    let data = await dataFinder(6000);
    data = designSequence(data);
    return data.slice(0, 10);
}


router.get("/", fetchCheckUser, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        let cardList = sequence(await Card.find());
        let FreqPurchasedList = await FreqPurchasedListFinder();
        let TopInDesignsList = await TopInDesignsListFinder();
        let categoryList = [] // sequence(await Category.find());
        let lessPriceList = lessPriceListFinder();
        let otherBrandList = sequence(await Brands.find());
        
        if (user) {
            if (user.seller) {
                res.render("indexAdmin.pug", { LoggedIn: 1, cardList, FreqPurchasedList, TopInDesignsList, categoryList, lessPriceList, otherBrandList })
            } else {
                res.render("index.pug", { LoggedIn: 1, cardList, FreqPurchasedList, TopInDesignsList, categoryList, lessPriceList, otherBrandList })

            }
        } else {
            res.render("index.pug", { cardList, FreqPurchasedList, TopInDesignsList, categoryList, lessPriceList, otherBrandList })
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
        if (user.seller) {
            const cardNo = req.body.cardNo;
            const title = req.body.title;
            const image = req.file.filename;
            const desc = req.body.desc;
            // const locateTo = req.body['locate-to'];
            // const location = req.body.location;

            // let oldCard = await Card.find({ cardNo: cardNo });
            // oldCard.forEach(card => {
            //     let path = "static/productImg/" + card.image;
            //     // Delete the file like normal
            //     fs.unlink(path, (err) => {
            //         if (err) console.log(err);
            //         return;
            //     });
            // })


            let newCard = new Card({
                cardNo: cardNo,
                title: title,
                image: image,
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