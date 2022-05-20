
const Campground = require("../Models/campground");

/***************************************************
    Creating index page 
*/
module.exports.index = async (req, res) => {
    const allCampgrounds = await Campground.find({})
    res.render("campgrounds/index", { allCampgrounds });
}

/***************************************************
    Create a new campsite
    get request shows the input form
    post request adds new campsite to database
*/
module.exports.renderNewCampsiteForm = (req, res) => {
    res.render("campgrounds/new");
    //res.send("NEW")
}

module.exports.createNewCampsite = async (req, res, next) => {
    //res.send(req.body);
    //console.log(req.body.campground);

    // Adding a photo since the campground doesnt have an image addition function yet
    req.body.campground.image = "https://source.unsplash.com/random/400×300/?forest";
    //console.log(req.body.campground);
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfuly created your new Campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
}

/***************************************************
    View details for a single campsite */
module.exports.viewCampgroundDetails = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    //console.log(campground);
    res.render("campgrounds/view", { campground });
}

/***************************************************
    Update a preexisting campsite
    get request shows the input form
    post request updates campsite in database
*/
module.exports.renderUpdateCampgroundForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash("error", "Cannot find that campsite");
        return res.redirect("/campgrounds");
    }
    res.render(`campgrounds/edit`, { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    //const newCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const newCampground = await Campground.findById(id);
    
    req.flash("success", "Successfuly updated your new Campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
    //console.log(newCampground);
}

/***************************************************
    Deletes a specified campground from database */
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const removed = await Campground.findByIdAndDelete(id);
    //console.log(removed);
    res.redirect("/campgrounds");
}