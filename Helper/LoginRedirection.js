module.exports.loginRedirection = (req, res, next) => {
    console.log(req.session.pastUrl);
    if (req.session.pastUrl) {
        res.locals.pastUrl = req.session.pastUrl
    }
    next();
}