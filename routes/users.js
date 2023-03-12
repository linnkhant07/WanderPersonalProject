const express = require('express')
const router = express.Router()
const user = require('../controllers/users')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

//CRUD
router.route('/register')
.get(user.renderRegisterForm) //register form
.post(catchAsync(user.registerUser)) //register the user


router.route('/login')
.get(user.renderLogInForm) //login form
.post(
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}),  
    user.logInUser
    ) //login the user

router.get('/logout', user.logOutUser)


module.exports = router