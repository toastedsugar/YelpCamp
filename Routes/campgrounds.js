const express = require("express");
const Router = express.Router();
const catchAsync = require("../Utils/catchAsync");
const Campground = require("../Models/campground");
const {isLoggedIn, isAuthor, validateCampground} = require("../Middleware");

// Importing controllers
const campgrounds = require("../Controllers/campgrounds");

Router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampsite))


Router.get("/new", isLoggedIn, campgrounds.renderNewCampsiteForm)

Router.route("/:id")
    .get(catchAsync(campgrounds.viewCampgroundDetails))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))

Router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderUpdateCampgroundForm))





module.exports = Router;