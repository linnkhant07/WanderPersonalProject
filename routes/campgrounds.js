const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} = require('../schemas')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

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
    campground.author = req.user._id;
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
    const campground = await Campground.findById(id).populate({path: 'reviews', 
    populate: {
        path: 'author'
    }
    }).populate('author');
    if(!campground){
        req.flash("error", "Cannot find campground")
        return res.redirect("/campgrounds")
    }
    res.render("campground/show", {campground})
}))

//Edit Route
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
    //get id
    const {id} = req.params;
    const campground = await Campground.findById(id);

    if(!campground){
        req.flash("error", "Cannot find campground")
        return res.redirect("/campgrounds")
    }

    res.render("campground/edit", {campground})

}))

//Update Route
router.put("/:id", isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
    //get id
    const {id} = req.params;

    //update in the db
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    if(!campground){
        req.flash("error", "Cannot find campground")
        return res.redirect("/campgrounds")
    }
    req.flash("success", "Campground successfully updated")
    res.redirect(`/campgrounds/${id}`)
}))

//Delete Route
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
    //get id
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    if(!campground){
        req.flash("error", "Cannot find campground")
        return res.redirect("/campgrounds")
    }

    //redirect
    req.flash("success", "Campground successfully deleted")
    res.redirect("/campgrounds")
}))

module.exports = router