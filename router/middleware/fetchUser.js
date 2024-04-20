const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.cookies.authtoken || 0
    try {
        if (!token) {
            req.session.returnTo = req.originalUrl;
            res.redirect("/login");
        } else {
            jwt.verify(token, JWT_SECRET, (err, data) => {
                if (err) {
                    // Invalid token
                    res.status(401).send({ error: "Invalid token." });
                } else {
                    // Valid token
                    req.user = data.user; // Add user ID to request object
                    next();
                }
            });
        };
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }


}


module.exports = fetchUser;