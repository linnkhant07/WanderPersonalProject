const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken})
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req,res)=>{
    //show all campgrounds
    const campgrounds = await Campground.find({});
    
    res.render("campground/index", {campgrounds})
}

module.exports.renderNewForm = (req,res)=>{res.render("campground/new")}

module.exports.createCampground = async(req,res)=>{

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    //create a new object with form details
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();

    req.flash("success", "Landmark successfully saved")
    //redirect to show page
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req,res)=>{
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
}

module.exports.renderEditForm = async(req,res)=>{
    //get id
    const {id} = req.params;
    const campground = await Campground.findById(id);

    if(!campground){
        req.flash("error", "Cannot find campground")
        return res.redirect("/campgrounds")
    }

    res.render("campground/edit", {campground})

}

module.exports.updateCampground = async(req,res)=>{
    //get id
    const {id} = req.params;

    //update in the db
    const images = req.files.map(f => ({url: f.path, filename: f.filename}))
    const campground = await Campground.findByIdAndUpdate(
        id,
        { $push: { images: { $each: images } }, ...req.body.campground },
        { new: true, runValidators: true }
      );

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }

    /*
    const images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...images)
    await campground.save()*/

    if(!campground){
        req.flash("error", "Cannot find campground")
        return res.redirect("/campgrounds")
    }
    req.flash("success", "Landmark successfully updated")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    //get id
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    if(!campground){
        req.flash("error", "Cannot find campground")
        return res.redirect("/campgrounds")
    }

    //redirect
    req.flash("success", "Landmark successfully deleted")
    res.redirect("/campgrounds")
}