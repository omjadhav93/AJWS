const mongoose = require('mongoose');

const CustomerRatingSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        rating: {
            overall: { type: Number, required: true, min: 0, max: 5 },
            design: { type: Number, min: 0, max: 5, default: 0 },
            quality: { type: Number, min: 0, max: 5, default: 0 },
            durability: { type: Number, min: 0, max: 5, default: 0 },
            costvalue: { type: Number, min: 0, max: 5, default: 0 }
        },
        feedback: { type: String, trim: true },
    },
    { timestamps: true }
);

CustomerRatingSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

CustomerRatingSchema.post("save", async function () {
    await mongoose.model("Product").updateProductRating(this.product_id);
});

CustomerRatingSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        await mongoose.model("Product").updateProductRating(doc.product_id);
    }
});

CustomerRatingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await mongoose.model("Product").updateProductRating(doc.product_id);
    }
});

const CustomerRating = mongoose.model("CustomerRating", CustomerRatingSchema);

module.exports = CustomerRating;