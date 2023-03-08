//require stuff
const express = require('express');
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const {campgroundSchema, reviewSchema} = require('./schemas')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require("./routes/reviews")

//for session
const session = require('express-session')
const sessionConfig = {
    secret: "siuuuucret", 
    httpOnly: true,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//for passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for flash
const flash = require('connect-flash')
app.use(flash())

//for login & flash
app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

//ejs set paths
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ejs set engine for layouts
app.engine('ejs', ejsMate);


//serving public files
app.use(express.static(path.join(__dirname, 'public')))

//to parse the data from req.body
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

//connect to mongoDB  using mongoose
const mongoose = require("mongoose");
const review = require('./models/review');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection; //fancier, cleaner and to close the connection in the future
//we can do usual things too - this is just another way ig
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

//strictQuery - only the specified fields in the Schema will be accepted
//to remove depreciation
mongoose.set('strictQuery', true);

//listen on port 3000
app.listen(3000, ()=>{
    console.log("Project listening on Port 3000!");
})

//default route
app.get("/", (req,res)=>{
    res.redirect("/campgrounds");
})



//CRUD 
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes) //for reviews
app.use("/", userRoutes)


//ERROR HANDLERS

//404 Not Found
app.all('*', (req,res,next)=>{
    next(new ExpressError("404 Page Not Found", 404))
})


//Basic Error Handler
app.use((err, req, res, next)=>{
   // const {message = "Something went wrong", statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong";
    if(!err.statusCode) err.statusCode = 400;

    res.status(err.statusCode).render("error", {err});
})













