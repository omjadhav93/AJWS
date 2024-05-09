const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const checkAuth = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.cookies.authtoken || 0
    try {
        if (token) {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log(err)
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
        console.log(error)
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


module.exports = checkAuth;