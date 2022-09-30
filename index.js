if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

// Include Dependencies Here
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const localStragegy = require("passport-local");
const methodOverride = require("method-override");

const ExpressError = require("./Utils/ExpressError.js");
const { findById } = require("./Models/campground");
const Users = require("./Models/users");
const {isAuthor} = require("./Middleware");

// Importing Routers
const campgroundRoutes = require("./Routes/campgrounds");
const reviewRoutes = require("./Routes/reviews");
const userRoutes = require("./Routes/users");

const secret =  process.env.SECRET || "ThisShouldBeABetterSecret"
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/YelpCamp"

//Connect to database
mongoose.connect(dbUrl, {
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

// Setting up session store
const storeOptions = {
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
}

const sessionConfig = {
    secret,
    store: MongoStore.create(storeOptions),
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 *7,
    }
}

app.use(session(sessionConfig));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStragegy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

// Setting up Routers
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


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


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log("Listening on port ", port);
})