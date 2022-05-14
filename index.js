// Include Dependencies Here
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./Utils/ExpressError.js");
const methodOverride = require("method-override");
const { findById } = require("./Models/campground");

// Importing Routers
const campgrounds = require("./Routes/campgrounds");
const reviews = require("./Routes/reviews");

//Connect to database
mongoose.connect("mongodb://localhost:27017/YelpCamp", {
    useNewURLParser: true,
    //createUserIndex: true,        // Not supported in mongoose?
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

// Initialize application
const app = express();

// Middleware
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));     // Used to override post requests with other request types
app.use(express.static(path.join(__dirname, "Public")));    // Used so routers can obtain :id from the base URL

// Setting up session
const sessionConfig = {
    secret: "ThisShouldBeABetterSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 *7,
    }
}
app.use(session(sessionConfig));

// Setting up Routers
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);


/***************************************************
    GET Request for homepage */
app.get("/", (req, res) => {
    //res.send("HELLO");
    res.render("home");
})

/***************************************************
    Generic Error handler   

app.use((err, req, res, next) => {
    res.send("Oh no!");
})
*/

app.all("*", (req, res, next) => {
    //res.send("404");
    next(new ExpressError("Page not found", 404));
})

/***************************************************
    Route not found (middleware)    
*/
app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    if (!err.message) err.message = "Oh, no!";
    res.status(statusCode).render("errors", { err });
    //res.status(statusCode).send(message);
    //res.status(404).send("NOT FOUND!!!");
})


const port = 5000
app.listen(port, () => {
    console.log("Listening on port ", port);
})