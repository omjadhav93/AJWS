const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchCheckUser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    let token = req.cookies.authtoken || 0
    try {
        if (!token) {
            req.user = null;
            next();
        } else {
            jwt.verify(token, JWT_SECRET, (err, data) => {
                if (err) {
                    // Invalid token
                    res.clearCookie('authtoken');
                    req.user = null;
                    next();
                } else {
                    // Valid token
                    req.user = data.user; // Add user ID to request object
                    next();
                }
            });
        };
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }


}


module.exports = fetchCheckUser;