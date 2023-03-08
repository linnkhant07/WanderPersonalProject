const express = require('express')
const router = express.Router({mergeParams: true}) 
const Campground = require('../models/campground')
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync')
const {reviewSchema} = require('../schemas')

//JOI Validator
const validateReview = (req,res,next) =>{
    //check if there is an error
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    }

    else{
        next();
    }
}

//Create route
router.post("/", validateReview, async(req,res)=>{
    //get campground id
    const {id} = req.params;

    const campground = await Campground.findById(id);
    const review  = new Review(req.body.review); 

    campground.reviews.push(review);
    await campground.save()
    await review.save()

    //flash
    req.flash("success", "Review successfully saved")

    res.redirect(`/campgrounds/${id}`)
})

//Delete route
router.delete("/:reviewId", catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router
