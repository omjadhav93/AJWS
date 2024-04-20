const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const checkAuth = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.cookies.authtoken || 0
    try {
        if (token) {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    // Invalid token
                    next();
                } else {
                    // Valid token
                    res.redirect("/");
                }
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


module.exports = checkAuth;