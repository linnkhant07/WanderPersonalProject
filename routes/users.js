const express = require('express')
const router = express.Router()
const user = require('../controllers/users')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

//CRUD
//register form
router.get('/register', user.renderRegisterForm)

//register the user
router.post('/register', catchAsync(user.registerUser))

//login form
router.get('/login', user.renderLogInForm)

//login the user
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}),  user.logInUser)

router.get('/logout', user.logOutUser)


module.exports = router