//require joi first
const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html')
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#lable}} must not include HTML!'
    },

    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAtrributes: {},
                });

                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                    return clean;
            }
        }
    }
})
const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    //campground is a key inside the object, and its properties are also objects
    campground: Joi.object({
        //its keys
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        //image: Joi.string().required(),
        description: Joi.string().escapeHTML()

    }).required(), //campground as a key is also required

    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        text: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})

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
