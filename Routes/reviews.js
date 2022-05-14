const express = require("express");
const Router = express.Router({ mergeParams: true });
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/ExpressError");

const Campground = require("../Models/campground");
const Review = require("../Models/review");
const { reviewSchema } = require("../schemas.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (result.error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/***************************************************
    Add a review to a post */
Router.post("/", catchAsync(async (req, res) => {
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
Router.delete("/:reviewID", catchAsync(async (req, res) => {
    //res.send("Delete me!")
    const { id, reviewID } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    const review = await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = Router;