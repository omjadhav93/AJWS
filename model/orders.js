var mongoose = require("mongoose");


var orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            // Combine timestamp with random number for uniqueness
            const timestamp = new Date().getTime().toString();
            const random = Math.floor(10000 + Math.random() * 90000).toString();
            return timestamp + random;
        }
    },

    'model-number': {
        type: String,
        required: true
    },
    
    'recevier-name': {
        type: String,
        required: true
    },

    'recevier-phone': {
        type: Number,
        required: true
    },
    
    image: {
        type: String,
        required: true
    },

    color: {
        type: String,
        required: true
    },

    address: {
        type: Object,
        required: true
    },

    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    quantity: {
        type: Number,
        required: true,
        default: 1
    },

    payment: {
        type: Boolean,
        required: true,
        default: false
    },

    payStatus: {
        type: String,
        required: true
    },

    orderStage: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

// Verification function to ensure orderId uniqueness before saving
orderSchema.pre('save', async function(next) {
    try {
        // Only check if this is a new document or if orderId was modified
        if (this.isNew || this.isModified('orderId')) {
            const Order = mongoose.model('Order');
            let isUnique = false;
            let maxAttempts = 10; // Prevent infinite loops
            let attempts = 0;
            
            // Keep trying until we find a unique ID or reach max attempts
            while (!isUnique && attempts < maxAttempts) {
                attempts++;
                const existingOrder = await Order.findOne({ orderId: this.orderId });
                
                if (!existingOrder) {
                    // We found a unique ID
                    isUnique = true;
                } else {
                    // Generate a new ID and try again
                    const timestamp = new Date().getTime().toString();
                    const random = Math.floor(10000 + Math.random() * 90000).toString();
                    this.orderId = timestamp + random;
                }
            }
            
            // If we couldn't find a unique ID after max attempts, throw an error
            if (!isUnique) {
                throw new Error('Failed to generate a unique orderId after multiple attempts');
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Order",orderSchema);