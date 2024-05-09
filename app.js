const express = require("express");
const session = require("express-session")
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const pug = require('pug');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


// Set up Global configuration access
dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/Refresh');
let PORT = process.env.PORT || 5500;
let SESSION_SECRET = process.env.SESSION_SECRET

// View Engine Setup
app.set("view engine", "pug");
app.set("views", "./views");

app.use('/static', express.static('static'))
app.use(express.json())
app.use(express.urlencoded({extended: false}));
// Use cookie-parser middleware to parse cookies
app.use(cookieParser());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Authenticate Router
const authenticate = require("./router/authenticate");
app.use('/auth',authenticate);

// Home Page Router
const index = require("./router/index");
app.use('/',index);

// Add Product Form
const addProduct = require("./router/addProduct");
app.use('/user/add-product',addProduct);

// Cart Form
const cart = require("./router/cart");
app.use('/user/',cart);

// Server Start
app.listen(PORT,() => {
    console.log(`The App Start On Port : ${PORT}`);
})