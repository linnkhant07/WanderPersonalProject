const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');

//strictQuery - only the specified fields in the Schema will be accepted
//to remove depreciation
mongoose.set('strictQuery', true);

//just to shorten
const Schema = mongoose.Schema;
const Review = require('./review')

const CampgroundSchema = new Schema({
    title: {
        type: String,
            required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    reviews: [
        {type: Schema.Types.ObjectId, ref: 'Review'}
    ]
})

CampgroundSchema.post('findOneAndDelete', async (camp)=>{
    //if there is any camp
    if(camp.reviews.length){
        const res = await Review.deleteMany({_id: {$in: camp.reviews}})
        console.log(res)
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;