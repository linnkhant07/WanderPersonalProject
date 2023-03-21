const Landmark = require('../models/landmark')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken})
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req,res)=>{
    //show all landmarks
    const landmarks = await Landmark.find({});
    
    res.render("landmark/index", {landmarks})
}

module.exports.renderNewForm = (req,res)=>{res.render("landmark/new")}

module.exports.createLandmark = async(req,res)=>{

    const geoData = await geocoder.forwardGeocode({
        query: req.body.landmark.location,
        limit: 1
    }).send()
    //create a new object with form details
    const landmark = new Landmark(req.body.landmark);
    landmark.geometry = geoData.body.features[0].geometry
    landmark.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    landmark.author = req.user._id;
    await landmark.save();

    req.flash("success", "Landmark successfully saved")
    //redirect to show page
    res.redirect(`/landmarks/${landmark._id}`)
}

module.exports.showLandmark = async(req,res)=>{
    //get id from url
    const {id} = req.params;
    const landmark = await Landmark.findById(id).populate({path: 'reviews', 
    populate: {
        path: 'author'
    }
    }).populate('author');
    if(!landmark){
        req.flash("error", "Cannot find landmark")
        return res.redirect("/landmarks")
    }
    res.render("landmark/show", {landmark})
}

module.exports.renderEditForm = async(req,res)=>{
    //get id
    const {id} = req.params;
    const landmark = await Landmark.findById(id);

    if(!landmark){
        req.flash("error", "Cannot find landmark")
        return res.redirect("/landmarks")
    }

    res.render("landmark/edit", {landmark})

}

module.exports.updateLandmark = async(req,res)=>{
    //get id
    const {id} = req.params;

    //update in the db
    const images = req.files.map(f => ({url: f.path, filename: f.filename}))
    const landmark = await Landmark.findByIdAndUpdate(
        id,
        { $push: { images: { $each: images } }, ...req.body.landmark },
        { new: true, runValidators: true }
      );

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await landmark.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }

    /*
    const images = req.files.map(f => ({url: f.path, filename: f.filename}))
    landmark.images.push(...images)
    await landmark.save()*/

    if(!landmark){
        req.flash("error", "Cannot find landmark")
        return res.redirect("/landmarks")
    }
    req.flash("success", "Landmark successfully updated")
    res.redirect(`/landmarks/${id}`)
}

module.exports.deleteLandmark = async(req,res)=>{
    //get id
    const {id} = req.params;
    const landmark = await Landmark.findByIdAndDelete(id);

    if(!landmark){
        req.flash("error", "Cannot find landmark")
        return res.redirect("/landmarks")
    }

    //redirect
    req.flash("success", "Landmark successfully deleted")
    res.redirect("/landmarks")
}