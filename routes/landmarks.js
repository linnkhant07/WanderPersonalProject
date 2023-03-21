const express = require('express')
const router = express.Router()
const landmark = require('../controllers/landmarks')
const {storage} = require('../cloudinary')
const multer = require('multer')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAuthor, validateLandmark} = require('../middleware')

const upload = multer({storage})
//CRUD
router.route("/")
.get(catchAsync(landmark.index)) //Index Route
.post(isLoggedIn, upload.array('landmark[image]'), validateLandmark,  catchAsync(landmark.createLandmark)) //Create route
/*.post(upload.array('landmark[image]'), (req, res)=> {
    console.log(req.body, req.files)
    res.send("SIuuuu")

})*/ //testing upload

//New Route
router.get("/new", isLoggedIn, landmark.renderNewForm)

//Show Route
router.route("/:id")
.get(catchAsync(landmark.showLandmark))
.put(isLoggedIn, isAuthor, upload.array('landmark[image]'), validateLandmark, catchAsync(landmark.updateLandmark)) //update route
.delete(isLoggedIn, isAuthor, catchAsync(landmark.deleteLandmark)) //delete route

//Edit Route
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(landmark.renderEditForm))


module.exports = router