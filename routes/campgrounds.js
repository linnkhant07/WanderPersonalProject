const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} = require('../schemas')
const {isLoggedIn} = require('../middleware')

//JOi validator function
const validateCampground = (req,res,next) => {

    //check if there is an error in the result returned
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        //this step is necessary because
        //error has a property details - array of objects
        //we will map through those objects and take a key "message"
        //.join is to join error messages if there are more
        //if(error.name === "ValidationError") msg = "Ball lr kwr"
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

//CRUD
//Index Route
router.get("/", catchAsync(async (req,res)=>{
    //show all campgrounds
    const campgrounds = await Campground.find({});
    
    res.render("campground/index", {campgrounds})
}))

//New Route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("campground/new")
})


//Create Route
router.post("/", validateCampground, isLoggedIn, catchAsync(async(req,res)=>{

    //if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
    //create a new object with form details
    const campground = new Campground(req.body.campground);
    await campground.save();
    console.log(campground);

    req.flash("success", "Campground successfully saved")
    //redirect to show page
    res.redirect(`/campgrounds/${campground._id}`)
}))

//Show Route
router.get("/:id", catchAsync(async(req,res)=>{
    //get id from url
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash("error", "Cannot find campground")
        res.redirect("/campgrounds")
    }
    res.render("campground/show", {campground})
}))

//Edit Route
router.get("/:id/edit", catchAsync(async(req,res)=>{
    //get id
    const {id} = req.params;
    const campground = await Campground.findById(id);

    res.render("campground/edit", {campground})

}))

//Update Route
router.put("/:id", catchAsync(async(req,res)=>{
    //get id
    const {id} = req.params;

    //update in the db
    await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash("success", "Campground successfully updated")
    res.redirect(`/campgrounds/${id}`)
}))

//Delete Route
router.delete("/:id", catchAsync(async(req,res)=>{
    //get id
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);

    //redirect
    req.flash("success", "Campground successfully deleted")
    res.redirect("/campgrounds")
}))

module.exports = router