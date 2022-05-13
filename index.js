const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./Utils/catchAsync.js")
const ExpressError = require("./Utils/ExpressError.js")
const { campgroundSchema, reviewSchema } = require("./schemas.js");

const Campground = require("./Models/campground");
const Review = require("./Models/review");

const methodOverride = require("method-override");
const { findById } = require("./Models/campground");

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

const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (result.error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (result.error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/*  GET Request for homepage */
app.get("/", (req, res) => {
    //res.send("HELLO");
    res.render("home");
})
/***************************************************
    Creating index page 
*/
app.get("/campgrounds", catchAsync(async (req, res) => {
    const allCampgrounds = await Campground.find({})
    res.render("campgrounds/index", { allCampgrounds });
}))

/***************************************************
    Create a new campsite
    get request shows the input form
    post request adds new campsite to database
*/
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
    //res.send("NEW")
})

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    //res.send(req.body);
    //console.log(req.body.campground);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

/***************************************************
    View details for a single campsite */
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    //console.log(campground);
    res.render("campgrounds/view", { campground });
}))

/***************************************************
    Update a preexisting campsite
    get request shows the input form
    post request updates campsite in database
*/
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render(`campgrounds/edit`, { campground });
}))

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const newCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${newCampground._id}`);
    //console.log(newCampground);
}))

/***************************************************
    Deletes a specified campground from database */
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const removed = await Campground.findByIdAndDelete(id);
    //console.log(removed);
    res.redirect("/campgrounds");
}))

/***************************************************
    Add a review to a post */
app.post("/campgrounds/:id/reviews", catchAsync(async (req, res) => {
    const { id } = req.params;
    //res.send("Yay");
    const campground = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

/***************************************************
    Delete a review from a post */
app.delete("/campgrounds/:id/reviews/:reviewID", catchAsync(async (req, res) => {
    //res.send("Delete me!")
    const { id, reviewID } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    const review = await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${campground._id}`);
}))


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