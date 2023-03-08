const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//strictQuery - only the specified fields in the Schema will be accepted
//to remove depreciation
mongoose.set('strictQuery', true);


const reviewSchema = new Schema({
    text: String,
    rating: Number
})

reviewSchema.post('findOneAndDelete', async(review) => {
    
})

module.exports = mongoose.model('Review', reviewSchema);