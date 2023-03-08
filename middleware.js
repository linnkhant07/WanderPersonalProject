module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //remember the route they came from
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to take this action')
        return res.redirect('/login')
    }

    next()
}

 