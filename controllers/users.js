const User = require('../models/user')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
}

module.exports.registerUser = async (req,res,next)=>{
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
    

}
module.exports.renderLogInForm = (req,res)=>{
    res.render('users/login')
}
module.exports.logInUser = (req,res)=>{
    
    //if successful
    const redirectUrl = req.session.returnTo || "/campgrounds"
    req.flash('success', "Welcome Back!")
    res.redirect(redirectUrl)
}
module.exports.logOutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err)
        return next(err)
        req.flash('success', "Goodbye!")
        res.redirect('/campgrounds')
        
})
}