const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schemas')
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //remember the route they came from
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to take this action')
        return res.redirect('/login')
    }

    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to perfrom that action!')
        return res.redirect(`/campgrounds/${id}`)
    }

    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to perfrom that action!')
        return res.redirect(`/campgrounds/${id}`)
    }

    next()
}
 

//JOi validator function
module.exports.validateCampground = (req,res,next) => {

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

//JOI Validator
module.exports.validateReview = (req,res,next) =>{
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