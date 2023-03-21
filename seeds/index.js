const Landmark = require('../models/landmark');
const cities = require('./cities')
const landmarks = require('./landmarks')
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

/*
const seedDB = async() => {
    //delete all the contents first
    await Landmark.deleteMany({});

    //randomly add 50 landmarks
    for(let i = 0; i < 50; i++){

        const randCity = generateRand(cities)
        //random properties of the camp
        const author = '63fae3fa828ec6e9905e8114'
        const location = `${randCity.city}, ${randCity.state}`;
        const title = `${generateRand(descriptors)} ${generateRand(places)}`;
        const image = `https://source.unsplash.com/random/300x300?camping,${i}`
        const description = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus natus cupiditate maxime! Commodi aperiam in consequatur. Asperiores consectetur incidunt quod enim beatae molestiae, a doloremque ratione tenetur quis dicta corrupti!";
        const price = Math.floor(Math.random() * 20) + 10;
        const geometry = { type: 'Point', coordinates: [ `${randCity.longitude}`, `${randCity.latitude}` ] };
        const  images = [
          {
            url: 'https://res.cloudinary.com/dznf6c94r/image/upload/v1678773883/YelpCamp/e7en7k6jwsvv8rf4bmmv.webp',
            filename : 'YelpCamp/e7en7k6jwsvv8rf4bmmv',

          },
          {
            url: 'https://res.cloudinary.com/dznf6c94r/image/upload/v1678773882/YelpCamp/h4nnnxs55cvfoqt7qb3l.webp',
            filename: 'YelpCamp/h4nnnxs55cvfoqt7qb3l',
          }
        ]
        //create a new camp object and save to DB
        const newCamp = new Landmark({author, geometry, location, title, images, description, price});
        await newCamp.save();
        console.log(newCamp);
    }
    
}*/

const seedDBLandmark = async() => {

  for(let landmark of landmarks){
    //random properties of the camp
    const author = '63fae3fa828ec6e9905e8114'
    const location = `${landmark.location}`;
    const title = `${landmark.title}`;
    const description = `${landmark.description}`;
    const price = landmark.estimatedPrice;
    const geometry = landmark.geometry;
    const  images = [
      {
        url: 'https://res.cloudinary.com/dznf6c94r/image/upload/v1678773883/YelpCamp/e7en7k6jwsvv8rf4bmmv.webp',
        filename : 'YelpCamp/e7en7k6jwsvv8rf4bmmv',

      },
      {
        url: 'https://res.cloudinary.com/dznf6c94r/image/upload/v1678773882/YelpCamp/h4nnnxs55cvfoqt7qb3l.webp',
        filename: 'YelpCamp/h4nnnxs55cvfoqt7qb3l',
      }
    ]
    //create a new camp object and save to DB
    const newCamp = new Landmark({author, geometry, location, title, images, description, price});
    await newCamp.save();
    console.log(newCamp);
  }
      

  
}

seedDBLandmark().then(()=>{
    //close the connection and end the console
    mongoose.connection.close();
});