const express = require('express');
const router = express.Router();
const Fuse = require('fuse.js');
const fetchCheckUser = require("./middleware/fetchCheckAuth")
const mongoose = require('mongoose');

const User = require("../model/user");

// Sample product dataset
const products = [
    { id: 1, name: 'Water Filter and Purifiers', category: 'Home and Kitchen Appliance' },
    // Add more products as needed
];

// Price Comparison
function comparePrice(priceComparisons, money) {
    if (priceComparisons.length > 0) {
        let check = false;
        const greaterThan = /\b(greater than|exceeds|higher than|more than|above|pricier than|over|just\s+over|cost-effective than|better value than)\b/gi;
        const lessThan = /\b(less than|lower than|under|just under|below|cheaper than|not more than|within budget of|affordable than)\b/gi;
        for (let i = 0; i < priceComparisons.length; i++) {
            pc = priceComparisons[i]
            price = pc.price
            if (typeof price == 'number') {
                if (greaterThan.test(pc.comparison)) {
                    if (money >= price) {
                        check = true;
                    } else {
                        check = false;
                    }
                }
                if (lessThan.test(pc.comparison)) {
                    if (money <= price) {
                        check = true;
                    } else {
                        check = false;
                    }
                }
            }
        }
        return check;
    } else {
        return false;
    }
}

function rankSort(rankData) {
    for (let i = 0; i < rankData.length; i++) {
        for (let j = i + 1; j < rankData.length; j++) {
            let discountedPriceI = rankData[i][0].originalPrice - (rankData[i][0].originalPrice * rankData[i][0].discount / 100)
            let discountedPriceJ = rankData[j][0].originalPrice - (rankData[j][0].originalPrice * rankData[j][0].discount / 100)
            if (rankData[j][1] > rankData[i][1]) {
                var temp = rankData[j]
                rankData[j] = rankData[i]
                rankData[i] = temp;
            } else if ((rankData[j][1] == rankData[i][1]) && (discountedPriceJ > discountedPriceI)) {
                var temp = rankData[j]
                rankData[j] = rankData[i]
                rankData[i] = temp;
            }
        }
    }
    let finalData = [];
    for (let i = 0; i < rankData.length; i++) {
        finalData.push(rankData[i][0]);
    }
    return finalData;
}

global.waterfilterandpurifiers = async function (priceComparisons, keywordCombinations) {
    let requireModel = require(`../model/waterfilterandpurifiers`);
    let data = await requireModel.find()
    let rankData = [];

    
    for (let i = 0; i < data.length; i++) {
        let rank = 0;
        keywordCombinations.forEach(combination => {
            const searchQuery = combination;
            if (data[i]['model-name'].length > 0) {
                if (data[i]['model-name'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            }
            if (data[i]['brand-name'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            if (data[i]['model-number'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            if (searchQuery.toLowerCase().indexOf(`${data[i]['tank-capacity']} l`) > -1) rank += 1;
            if (searchQuery.toLowerCase().indexOf(`${data[i]['stages']} stage`) > -1) rank += 1;
            // if (data[i].warranty) rank += Number(data[i]['warranty-count'][0]);
            if (data[i]['material'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            if (data[i]['filter-type'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            if (data[i]['color'].indexOf(`${searchQuery.slice(0, 1).toUpperCase()}${searchQuery.slice(1).toLowerCase()}`) > -1) rank += 1;
            let fm = data[i]['filteration-method']
            for (let j = 0; j < fm.length; j++) {
                if (fm[j].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) {
                    rank += 1;
                    j = fm.length;
                }
            }
            let ic = data[i]['included-components']
            for (let j = 0; j < ic.length; j++) {
                if (ic[j].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) {
                    rank += 1;
                    j = ic.length;
                }
            }
        });
        let discountedPrice = data[i].originalPrice - (data[i].originalPrice * data[i].discount / 100)
        if (comparePrice(priceComparisons, discountedPrice)) {
            rank = rank * 2;
        }

        rankData.push([data[i], rank])
    }

    let finalData = rankSort(rankData)
    return finalData;
}

global.allcategory = async function (priceComparisons, keywordCombinations) {
    let waterfilterandpurifiers = require(`../model/waterfilterandpurifiers`);
    let waterfilterandpurifiersData = await waterfilterandpurifiers.find()
    let data = waterfilterandpurifiersData //.concat(array2,array3)
    let rankData = [];

    for (let i = 0; i < data.length; i++) {
        let rank = 0;
        keywordCombinations.forEach(combination => {
            const searchQuery = combination;
            if (data[i]['model-name'].length > 0) {
                if (data[i]['model-name'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            }
            if (data[i]['brand-name'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            if (data[i]['model-number'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            if (data[i].warranty) rank += Number(data[i]['warranty-count'][0]);
            if (data[i]['filter-type'].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) rank += 1;
            if (data[i]['color'].indexOf(`${searchQuery.slice(0, 1).toUpperCase()}${searchQuery.slice(1).toLowerCase()}`) > -1) rank += 1;
        });
        let discountedPrice = data[i].originalPrice - (data[i].originalPrice * data[i].discount / 100)
        if (comparePrice(priceComparisons, discountedPrice)) {
            rank = rank * 2;
        }

        rankData.push([data[i], rank])
    }

    let finalData = rankSort(rankData)
    return finalData;
}
















// Searching Functions Starts here

function extractPriceComparisons(text) {
    const regex = /(\bless than\b|\blower than\b|\bjust\s+over\b|\bunder\b|\bjust under\b|\bbelow\b|\bcheaper than\b|\bnot more than\b|\bwithin budget of\b|\baffordable than\b|\bgreater than\b|\bcost-effective than\b|\bbetter value than\b|\bexceeds\b|\bhigher than\b|\bmore than\b|\babove\b|\bpricier than\b|\bover\b)(?:.*?)(\d+(?:\.\d{2})?)/gi;
    const betweenRegex = /(between|from|starting(\s+at)*|within(\s+range)*(\s+of)*)(?:.*?)(\d+(\.\d{2})?)(?:.*?)(,|and|to|ending(\s+at)*)(?:.*?)(\d+(\.\d{2})?)/gi
    const nearRegex = /(closer|near|nearer|close\s+to|approximately|around|nearby|about|almost)(?:.*?)(\d+(\.\d{2})?)/gi

    const matches = [];
    let match;
    while ((match = regex.exec(text))) {
        const comparison = match[1];
        const price = Number(match[2].replace(/,/g, ''));
        matches.push({ comparison, price });
    }
    while ((match = betweenRegex.exec(text))) {
        const price1 = match[3];
        const price2 = match[7];
        {
            const comparison = 'greater than';
            const price = Math.min(price1, price2);
            matches.push({ comparison, price });
        }
        {
            const comparison = 'less than';
            const price = Math.max(price1, price2);
            matches.push({ comparison, price });
        }
    }
    while ((match = nearRegex.exec(text))) {
        const price1 = Number(match[2]) - 1000;
        const price2 = Number(match[2]) + 1000;
        {
            const comparison = 'greater than';
            const price = price1;
            matches.push({ comparison, price });
        }
        {
            const comparison = 'less than';
            const price = price2;
            matches.push({ comparison, price });
        }
    }
    return matches;
}

function removeStopwordsAndPriceComparisons(text) {
    const stopwords = ['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'i', 'in', 'is', 'it', 'its', 'me', 'of', 'on', 'that', 'the', 'to', 'was', 'we', 'were', 'with', 'you',];
    const priceComparisons = ['less than', 'lower than', 'under', 'below', 'cheaper than', 'not more than', 'within budget of', 'affordable than', 'cost-effective than', 'better value than', 'exceeds', 'higher than', 'more than', 'above', 'pricier than', 'over'];

    const stopwordsRegex = new RegExp(`\\b(${stopwords.join('|')})\\b\\s*`, 'gi');
    const priceComparisonsRegex = new RegExp(`\\b(${priceComparisons.join('|')})\\b\\s*`, 'gi');
    const extraSpace = new RegExp('\\s{2,}', 'g')

    const processedText = text.replace(stopwordsRegex, '').replace(priceComparisonsRegex, '').replace(extraSpace, ' ');

    return processedText.trim();
}

function generateKeywordCombinations(keywords) {
    const combinations = [];

    function generateCombinations(currentCombination, remainingKeywords) {
        if (remainingKeywords.length === 0) {
            combinations.push(currentCombination.join(" "))
            return;
        }
        if (currentCombination.length > 1) {
            combinations.push(currentCombination.join(" "))
        }

        let lastIndex, newStart;

        if (remainingKeywords.indexOf(" ") > 0) {
            lastIndex = remainingKeywords.indexOf(" ")
            newStart = remainingKeywords.indexOf(" ") + 1;
        } else {
            lastIndex = remainingKeywords.length
            newStart = remainingKeywords.length
        }

        const currentKeyword = remainingKeywords.slice(0, lastIndex);
        const remaining = remainingKeywords.slice(newStart);

        combinations.push(currentKeyword);
        generateCombinations(currentCombination.concat(currentKeyword), remaining);
    }

    generateCombinations([], keywords);

    return combinations;
}


// Function to perform fuzzy search on products
function searchProduct(query) {
    // Create a new Fuse instance with the products dataset and desired options
    const fuse = new Fuse(products, {
        keys: ['name', 'category'], // Properties to search for matches
        includeScore: true, // Include search score in results
        threshold: 0.4, // Adjust the threshold for fuzzy matching (0.0 to 1.0)
    });

    // Perform the search
    const results = fuse.search(query);

    // Return the top matching result (if any)
    return results.length > 0 ? results[0].item : { id: 0, name: 'Water Filter and Purifiers', category: 'Home and Kitchen Appliance' };
}




router.get("/search", fetchCheckUser, async (req, res) => {
    let userId = (req.user != null) ? req.user.id : new mongoose.Types.ObjectId('5f56a08d8d22222222222222');
    const user = await User.findById(userId).select("-password");
    try {
        let text = req.query.value
        const priceComparisons = extractPriceComparisons(text);
        const processedText = removeStopwordsAndPriceComparisons(text);
        const keywordCombinations = generateKeywordCombinations(processedText);
        const product = searchProduct(processedText);
        let productName;
        productName = product.name
        productName = productName.replace(/\s/g, '').toLowerCase()
        
        let data = await global[productName](priceComparisons, keywordCombinations);
        // We have not design a condition for rendering data
        

        // Rendering Files
        if (user) {
            res.render("search.pug", { LoggedIn: 1, data: data, searchStatement: text, })
        } else {
            res.render("search.pug", { data: data, searchStatement: text })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



module.exports = router