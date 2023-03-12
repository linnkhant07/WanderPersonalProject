const express = require('express')
const router = express.Router({mergeParams: true}) 
const Campground = require('../models/campground')
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

//Create route
router.post("/", isLoggedIn, validateReview, async(req,res)=>{
    //get campground id
    const {id} = req.params;

    const campground = await Campground.findById(id);
    const review  = new Review(req.body.review); 
    review.author = req.user._id;

    campground.reviews.push(review);
    await campground.save()
    await review.save()

    //flash
    req.flash("success", "Review successfully saved")

    res.redirect(`/campgrounds/${id}`)
})

//Delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router
