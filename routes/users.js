const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

//CRUD
//register form
router.get('/register', (req,res)=>{
    res.render('users/register')
})

//register the user
router.post('/register', catchAsync(async (req,res,next)=>{
    try {
        const {username, email, password: hashedPassword} = req.body.user
        const user = new User({email, username})
        const registeredUser = await User.register(user, hashedPassword)
        
        req.login(registeredUser, (err) => {
            if(err)
                return next(err)
            
            req.flash('success', 'Welcome to campgrounds!')
            res.redirect("/campgrounds")
        })

    } catch (error) {
        req.flash('error', error.message)
        res.redirect("/register")
    }
    

}))

//login form
router.get('/login', (req,res)=>{
    res.render('users/login')
})

//login the user
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}),  (req,res)=>{
    
    //if successful
    const redirectUrl = req.session.returnTo || "/campgrounds"
    req.flash('success', "Welcome Back!")
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err)
        return next(err)
        req.flash('success', "Goodbye!")
        res.redirect('/campgrounds')
        
})
})


module.exports = router