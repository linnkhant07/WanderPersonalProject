const Campground = require('../models/campground');
const cities = require('./cities')
const {descriptors, places} = require("./seedHelpers")

//connect to mongoDB  using mongoose
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection; //fancier, cleaner and to close the connection in the future
//we can do usual things too - this is just another way ig
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const generateRand = (arr) => {
   
    //random index in the range of the arr length
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

const seedDB = async() => {
    //delete all the contents first
    await Campground.deleteMany({});

    //randomly add 50 campgrounds
    for(let i = 0; i < 50; i++){

        //random properties of the camp
        const author = '63fae3fa828ec6e9905e8114'
        const location = `${generateRand(cities).city}, ${generateRand(cities).state}`;
        const title = `${generateRand(descriptors)} ${generateRand(places)}`;
        const image = `https://source.unsplash.com/random/300x300?camping,${i}`
        const description = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus natus cupiditate maxime! Commodi aperiam in consequatur. Asperiores consectetur incidunt quod enim beatae molestiae, a doloremque ratione tenetur quis dicta corrupti!";
        const price = Math.floor(Math.random() * 20) + 10;

        //create a new camp object and save to DB
        const newCamp = new Campground({author, location, title, image, description, price});
        await newCamp.save();
        console.log(newCamp);
    }
    
}

seedDB().then(()=>{
    //close the connection and end the console
    mongoose.connection.close();
});