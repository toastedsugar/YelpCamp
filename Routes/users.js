const express = require("express");
const Router = express.Router({ mergeParams: true });
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/ExpressError");

const users = require("../Models/users");
const e = require("connect-flash");
const passport = require("passport");
const { nextTick } = require("process");
//const { userSchema } = require("../schemas.js");

//Get a website 
Router.get("/register", catchAsync(async (req, res) => {
    res.render("Users/register");
}))

// Register new user
Router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body.user;
        const newUser = new users({ email, username });
        const registeredUser = await users.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next();
        })
        req.flash("success", "New account created");
        res.redirect("/campgrounds");
    }catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}))

// Log in
Router.get("/login", catchAsync(async (req, res) => {
    res.render("Users/login");
})) 

Router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), catchAsync(async (req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;

    res.redirect(redirectUrl); 
}))

// Log out
Router.get("/logout", (req, res) => {
    req.logout;
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
})


module.exports = Router;