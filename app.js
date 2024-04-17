const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const pug = require('pug');
const dotenv = require('dotenv');


// Set up Global configuration access
dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/Refresh');
let PORT = process.env.PORT || 5500;

// View Engine Setup
app.set("view engine", "pug");
app.set("views", "./views");

app.use('/static', express.static('static'))
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// Home Page Router
app.get('/',(req,res) => {
    res.render("index")
})

// Authenticate Router
const authenticate = require("./router/authenticate");
app.use('/auth',authenticate);

// Server Start
app.listen(PORT,() => {
    console.log(`The App Start On Port : ${PORT}`);
})