const express = require('express');
const router = express.Router();
const User = require('../../model/user');
const Otp = require('../../model/otp');

router.get('/cleanupOtp', async (req, res) => {
    try {
        const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

        // Find OTPs that expired (createdAt older than 20 min)
        await Otp.deleteMany({ createdAt: { $lt: twentyMinutesAgo } });

        // Find unverified User and delete.
        await User.deleteMany({ createdAt: { $lt: twentyMinutesAgo }, isVerified: false });

        res.status(200).send("Cleanup completed successfully");
    } catch (error) {
        console.error("Error in cleanup job:", error);
        res.status(500).send("Internal Server Error in cleanup");
    }
});

module.exports = router;
