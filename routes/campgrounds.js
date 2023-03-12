const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const campground = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} = require('../schemas')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

//CRUD
//Index Route
router.get("/", catchAsync(campground.index))

//New Route
router.get("/new", isLoggedIn, campground.renderNewForm)

//Create Route
router.post("/", validateCampground, isLoggedIn, catchAsync(campground.createCampground))

//Show Route
router.get("/:id", catchAsync(campground.showCampground))

//Edit Route
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

//Update Route
router.put("/:id", isLoggedIn, isAuthor, catchAsync(campground.updateCampground))

//Delete Route
router.delete("/:id", isLoggedIn, isAuthor, catchAsync())

module.exports = router