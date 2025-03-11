const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
    overall: { type: Number, min: 0, max: 5, default: 0 },
    design: { type: Number, min: 0, max: 5, default: 0 },
    quality: { type: Number, min: 0, max: 5, default: 0 },
    durability: { type: Number, min: 0, max: 5, default: 0 },
    costvalue: { type: Number, min: 0, max: 5, default: 0 },
});

const productTypeInitials = {
    "Water Filter and Purifiers": "WF",
    "Water Filter Cabinet": "WFC"
};

const generateRandomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
};

const ProductSchema = new mongoose.Schema(
    {
        seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        model_number: { type: String, unique: true },
        product_category: { type: String, required: true },
        product_type: { type: String, required: true },
        product_details: { type: mongoose.Schema.Types.ObjectId, required: true },
        color: { type: [String], required: true },
        model_name: { type: String, required: true },
        brand_name: { type: String, required: true },
        material: { type: String, required: true },
        warranty: { type: Number, default: 0 },
        price: { type: Number, required: true },
        discount: { type: Number, min: 0, max: 100 },
        image: {type: [Object], required: true},
        available: { type: Boolean, required: true },
        buyers_count: { type: Number, default: 0 },
        visitors_count: { type: Number, default: 0 },
        rating: { type: RatingSchema, default: {} },
    },
    { timestamps: true }
);

ProductSchema.statics.updateProductRating = async function (productId) {
    const ratings = await mongoose.model("CustomerRating").find({ product_id: productId });
    
    if (ratings.length === 0) {
        // If no ratings, set all to 0
        await this.findByIdAndUpdate(productId, { 
            "rating.overall": 0,
            "rating.design": 0,
            "rating.quality": 0,
            "rating.durability": 0,
            "rating.costvalue": 0
        });
        return;
    }
    
    // Calculate average for each rating aspect
    const ratingSum = {
        overall: 0,
        design: 0,
        quality: 0,
        durability: 0,
        costvalue: 0
    };
    
    ratings.forEach(rating => {
        ratingSum.overall += rating.rating.overall || 0;
        ratingSum.design += rating.rating.design || 0;
        ratingSum.quality += rating.rating.quality || 0;
        ratingSum.durability += rating.rating.durability || 0;
        ratingSum.costvalue += rating.rating.costvalue || 0;
    });
    
    const ratingCount = ratings.length;
    
    await this.findByIdAndUpdate(productId, {
        "rating.overall": ratingSum.overall / ratingCount,
        "rating.design": ratingSum.design / ratingCount,
        "rating.quality": ratingSum.quality / ratingCount,
        "rating.durability": ratingSum.durability / ratingCount,
        "rating.costvalue": ratingSum.costvalue / ratingCount
    });
};

ProductSchema.pre("save", async function (next) {
    if (!this.model_number) {
        const typeInitial = productTypeInitials[this.product_type] || "XX";
        const brandCode = this.brand_name.replace(/\s/g, "");
        let modelNumber;
        do {
            modelNumber = typeInitial + brandCode + generateRandomNumber();
        } while (await mongoose.model("Product").exists({ model_number: modelNumber }));
        this.model_number = modelNumber;
    }
    next();
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
