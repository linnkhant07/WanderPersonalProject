const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const campground = require('../controllers/campgrounds')
const {storage} = require('../cloudinary')
const multer = require('multer')
const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} = require('../schemas')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

const upload = multer({storage})
//CRUD
router.route("/")
.get(catchAsync(campground.index)) //Index Route
.post(isLoggedIn, upload.array('campground[image]'), validateCampground,  catchAsync(campground.createCampground)) //Create route
/*.post(upload.array('campground[image]'), (req, res)=> {
    console.log(req.body, req.files)
    res.send("SIuuuu")

})*/ //testing upload

//New Route
router.get("/new", isLoggedIn, campground.renderNewForm)

//Show Route
router.route("/:id")
.get(catchAsync(campground.showCampground))
.put(isLoggedIn, isAuthor, upload.array('campground[image]'), validateCampground, catchAsync(campground.updateCampground)) //update route
.delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground)) //delete route

//Edit Route
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))


module.exports = router