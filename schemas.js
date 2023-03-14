//require joi first
const Joi = require('joi')

/*
//joi schema validator //Joi.{data type}
const campgroundSchema = Joi.object({
    //campground is a key inside the object, and its properties are also objects
    campground: Joi.object({
        //its keys
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string()

    }).required() //campground as a key is also required
})
*/

module.exports.campgroundSchema = Joi.object({
    //campground is a key inside the object, and its properties are also objects
    campground: Joi.object({
        //its keys
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        //image: Joi.string().required(),
        description: Joi.string()

    }).required() //campground as a key is also required
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        text: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})