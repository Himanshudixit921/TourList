module.exports.loginValidation = (req, res, next) => {
    if (req.isUnauthenticated()) {
        req.session.pastUrl = req.originalUrl;
        req.flash('error', "You must be logged in")
        return res.redirect('/login')
    }
    next()
}