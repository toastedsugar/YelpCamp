const express = require("express");
const Router = express.Router();
const catchAsync = require("../Utils/catchAsync");
const Campground = require("../Models/campground");
const {storage} = require("../Cloudinary/index");
const {isLoggedIn, isAuthor, validateCampground} = require("../Middleware");

const multer = require("multer");
const upload = multer({storage});

// Importing controllers
const campgrounds = require("../Controllers/campgrounds");

Router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(upload.array("image"), (req, res) => {
        console.log(req.body, req.files);
        res.send("It worked");
    })




Router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, upload.single("campground.image") , catchAsync(campgrounds.createNewCampsite))


Router.get("/new", isLoggedIn, campgrounds.renderNewCampsiteForm)

Router.route("/:id")
    .get(catchAsync(campgrounds.viewCampgroundDetails))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))

Router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderUpdateCampgroundForm))





module.exports = Router;