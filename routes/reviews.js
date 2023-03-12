const express = require('express')
const router = express.Router({mergeParams: true}) 
const review = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

//Create route
router.post("/", isLoggedIn, validateReview, review.createReview)

//Delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  catchAsync(review.deleteReview))

module.exports = router
