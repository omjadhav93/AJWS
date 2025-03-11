const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fetchCheckAuth = require("./middleware/fetchCheckAuth");
const bcrypt = require("bcrypt");


const User = require("../model/user");
const { Favourite, CancleOrder } = require('../model/lists');
const Order = require('../model/orders');
const { Brand } = require('../model/home');
const Product = require('../model/product');
const { WaterFilter, WaterFilterCabinet } = require("../model/productmodels/home&kitchenappliances");

async function dataFinder(compare) {
    let data = await Product.find({ price: { $gte: compare } });
    return Array.isArray(data) ? data : [data]
}


/* Sorting As per frequency of buying. */
function freqMerge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].buyers_count == right[rightIndex].buyers_count) {
            if (left[leftIndex].visitors_count > right[rightIndex].visitors_count) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        } else if (left[leftIndex].buyers_count > right[rightIndex].buyers_count) {
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
    data = data.slice(0, 10);
    let finalData = [];
    data.forEach(item => {
        const imageArr = item.image;
        const imageLocArr = Object.values(imageArr[0])[0];
        finalData.push({
            'model-number': item['model-number'],
            image: imageLocArr[0],
        })
    })

    return finalData;
}

router.get('/frequent', async (req, res) => {
    try {
        const data = await FreqPurchasedListFinder();
        res.status(200).send(data);
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

/* Sorting as per Low Price. */
function priceMerge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].price < right[rightIndex].price) {
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
    data = data.slice(0, 10);
    let finalData = [];
    data.forEach(item => {
        const imageArr = item.image;
        const imageLocArr = Object.values(imageArr[0])[0];
        finalData.push({
            'model-number': item['model-number'],
            image: imageLocArr[0],
        })
    })

    return finalData;
}

router.get('/lessPrice', async (req, res) => {
    try {
        const data = await lessPriceListFinder();
        res.status(200).send(data);
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})


/* Sorting as per design ratings. */
function designMerge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        const leftRating = left[leftIndex].rating && left[leftIndex].rating.design ? left[leftIndex].rating.design : 0;
        const rightRating = right[rightIndex].rating && right[rightIndex].rating.design ? right[rightIndex].rating.design : 0;

        if (leftRating > rightRating) {
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
    data = data.slice(0, 10);
    let finalData = [];
    data.forEach(item => {
        const imageArr = item.image;
        const imageLocArr = Object.values(imageArr[0])[0];
        finalData.push({
            'model-number': item['model-number'],
            image: imageLocArr[0],
        })
    })

    return finalData;
}

router.get('/topDesign', async (req, res) => {
    try {
        const data = await TopInDesignsListFinder();
        res.status(200).send(data);
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

/* Add, Remove and Get List of Products in favourites. */
async function dataByModelNo(list) {
    if (list.length == 0) {
        return [];
    }
    let data = [];
    for (const modelNo of list) {
        let productData = await Product.findOne({ model_number: modelNo });
        let productDetails;
        if (productData.product_type === "Water Filter and Purifiers") {
            productDetails = await WaterFilter.findById(productData.product_details);
        } else if (productData.product_type === "Water Filter Cabinet") {
            productDetails = await WaterFilterCabinet.findById(productData.product_details);
        }
        const { _id: detailsId, ...detailsWithoutId } = productDetails._doc;
        productData = {
            ...productData._doc,
            ...detailsWithoutId
        };
        data.push(productData);
    }

    return data;
}

router.get('/favourite', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    try {
        const favList = await Favourite.findOne({ user_id: userId });
        if (favList) {
            let favProducts = await dataByModelNo(favList.modelNums);
            res.status(200).send(favProducts);
        } else {
            res.status(200).send([]);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.post('/addFav', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            return res.status(200).send({ msg: "Unsigned" });
        }

        const modelNo = req.body.modelNo;
        let oldFav = await Favourite.findOne({ user_id: userId });

        if (!oldFav) {
            oldFav = new Favourite({ user_id: userId })
        }

        if (!oldFav.modelNums.includes(modelNo)) {
            let newModel = [modelNo]
            oldFav.modelNums = newModel.concat(oldFav.modelNums);
        }

        oldFav.save().then(() => {
        }).catch(err => {
            if (err) {
                res.status(400).send({ msg: err });
            }
        })

        res.status(200).send({ msg: "Success" });

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

router.post('/removeFav', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            return res.status(200).send({ msg: "Unsigned" });
        }

        const modelNoToRemove = req.body.modelNo;
        const oldFav = await Favourite.findOne({ user_id: userId });

        if (!oldFav) {
            return res.status(200).send({ msg: "No favorites found for the user" });
        }

        if (oldFav.modelNums.includes(modelNoToRemove)) {
            // Remove the model number from the array
            oldFav.modelNums = oldFav.modelNums.filter(num => num !== modelNoToRemove);
            await oldFav.save();

            res.status(200).send({ msg: "Success" });
        } else {
            res.status(200).send({ msg: "Model number not found in favorites" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

/* Update User Info */
router.post('/auth/update', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("+password");
    try {
        if (!user) {
            return res.status(200).send({ msg: "You have not signed in correctly!" });
        }

        let hash = user.password

        const result = await bcrypt.compare(req.body.password, hash)

        if (!result) {
            return res.status(200).send({ msg: "Wrong Password!" });
        }

        let check = false;

        if (req.body['first-name'] && req.body['last-name']) {
            const firstName = req.body['first-name'];
            const lastName = req.body['last-name'];
            if ((user.firstName = firstName) && (user.lastName = lastName)) {
                check = true;
            }
        }
        if (req.body.email) {
            if (user.email = req.body.email) {
                check = true;
            }
        }
        if (req.body.phone) {
            if (user.phone = req.body.phone) {
                check = true;
            }
        }

        if (check) {
            user.save().then(() => {
                res.status(200).send({ msg: "Changes Saved Successfully! Reload Page To See Changes." });
            }).catch(err => {
                res.status(400).send({ msg: `Error to save details: ${err}` });
            })
        } else {
            res.status(200).send({ msg: "Please provide at least one field to update." });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

router.get('/orders', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            return res.status(200).send({ msg: "You have not signed in correctly!" });
        }

        const orders = await Order.find({ user_id: userId }).sort({ orderDate: -1 }).exec();

        res.status(200).send(orders);

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

router.post('/order/update', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            return res.status(200).send({ msg: "You have not signed in correctly!" });
        }

        if (!user.seller) {
            return res.status(200).send({ msg: "You are not autherized to edit orders!" });
        }

        const orderIds = req.body.orderIds;
        const changeStage = req.body.stage;

        for (const orderId of orderIds) {
            const order = await Order.findOne({ orderId: orderId });
            order.orderStage = changeStage;

            await order.save();
        }

        res.status(200).send({ msg: "Order stage changed successfully." });

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

router.get('/order/cancle/reason', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            return res.status(200).send({ msg: "You have not signed in correctly!" });
        }

        const reason = await CancleOrder.findOne({ orderId: req.query.orderId });

        res.status(200).send(reason);

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})


router.get('/seller/products', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        if (!user) {
            return res.status(200).send({ msg: "You have not signed in correctly!" });
        }

        if (!user.seller) {
            return res.status(200).send({ msg: "You are not autherized to edit orders!" });
        }

        const products = await Product.find({ seller_id: userId }).sort({ updatedAt: -1 }).exec();
        // Get product details for each product
        for (let i = 0; i < products.length; i++) {
            let productDetails;
            if (products[i].product_type === "Water Filter and Purifiers") {
                productDetails = await WaterFilter.findById(products[i].product_details);
            } else if (products[i].product_type === "Water Filter Cabinet") {
                productDetails = await WaterFilterCabinet.findById(products[i].product_details);
            }
            const { _id: detailsId, ...detailsWithoutId } = productDetails._doc;
            products[i] = {
                ...products[i]._doc,
                ...detailsWithoutId
            };
        }

        res.status(200).send(products);

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

router.get('/brands', fetchCheckAuth, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        const brands = await Brand.find().sort({ updatedAt: -1 }).exec();

        res.status(200).send(brands);

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

module.exports = router;