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
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data.user;
            next();
        }
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }


}


module.exports = fetchUser;