const { campgroundSchema, reviewSchema } = require("./schemas.js");
const campground = require("./Models/campground");
const ExpressError = require("./Utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Must be Logged in");
        res.redirect("/login");
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const newCampground = await campground.findById(id);
    if (!newCampground.author.equals(req.user._id)){
        req.flash("error", "You are not the author")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (result.error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}