const express = require("express");
const Router = express.Router();
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/ExpressError");

const Campground = require("../Models/campground");
const { campgroundSchema } = require("../schemas.js");


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/***************************************************
    Creating index page 
*/
Router.get("/", catchAsync(async (req, res) => {
    const allCampgrounds = await Campground.find({})
    res.render("campgrounds/index", { allCampgrounds });
}))

/***************************************************
    Create a new campsite
    get request shows the input form
    post request adds new campsite to database
*/
Router.get("/new", (req, res) => {
    res.render("campgrounds/new");
    //res.send("NEW")
})

Router.post("/", validateCampground, catchAsync(async (req, res, next) => {
    //res.send(req.body);
    //console.log(req.body.campground);

    // Adding a photo since the campground doesnt have an image addition function yet
    req.body.campground.image = "https://source.unsplash.com/random/400×300/?forest";
    //console.log(req.body.campground);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Successfuly created your new Campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

/***************************************************
    View details for a single campsite */
Router.get("/:id", catchAsync(async (req, res) => {
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
Router.get("/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render(`campgrounds/edit`, { campground });
}))

Router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const newCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successfuly updated your new Campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
    //console.log(newCampground);
}))

/***************************************************
    Deletes a specified campground from database */
Router.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const removed = await Campground.findByIdAndDelete(id);
    //console.log(removed);
    res.redirect("/campgrounds");
}))



module.exports = Router;