const Review = require('../models/review')
const Landmark = require('../models/landmark')

module.exports.createReview = async(req,res)=>{
    //get landmark id
    const {id} = req.params;

    const landmark = await Landmark.findById(id);
    const review  = new Review(req.body.review); 
    review.author = req.user._id;

    landmark.reviews.push(review);
    await landmark.save()
    await review.save()

    //flash
    req.flash("success", "Review successfully saved")

    res.redirect(`/landmarks/${id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await Landmark.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted")
    res.redirect(`/landmarks/${id}`);
}