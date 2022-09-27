# YelpCamp
This is the full stack web application I created as part of Colt Steele's Web Developer Bootcamp Udemy course

This application relies heavliy on bootstrap for the frontend because the focus was to learn to create a full application.
The splash page was created using only HTML and CSS to demonstrate my ability with the two.

This application contains the following
    - RESTful routing
    - Reading and writing to a MongoDB database
    - User Creation, authentication and authorization
    - User sessions and cookies
    - Working with external APIs (for image storage)
    - Campground creation and editing (by the user who created that campsite)
    - User Reviews for every campsite
    - Created seeds to populate website with fake users
    - Error handling


# Routes
Campgrounds:
Base URL: '/campgrounds'
    GET     '/'             View the list of campgrounds
    POST    '/'             Submit a new campground
    GET     '/new'          View the campground creation page
    GET     '/:id'          View a specific campground
    POST    '/:id'          Submit a change to a campground
    DELETE  '/:id'          Remove a campground from website
    GET     '/:id/edit'     View the campground edit page

Users: 
Base URL: '/'
    GET     '/register'         View the new user registration page
    POST    '/register'         Submit information to create new user
    GET     '/login'            View login page
    POST    '/login'            Submit login
    GET     '/logout'           Log out of user profile

Reviews:
Base URL: '/campgrounds/:id/reviews'
    POST    '/'             Sumbits a review to a campsite           
    DELETE  '/:reviewID'    Deletes a review from a campsite


# Credits
Colt Steele for creating the course

Splash image provided by Mike Dennler
 - https://unsplash.com/photos/T9CktnMI8TQ



 
