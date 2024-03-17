module.exports.register = (req, res) => {
    res.render('User/register.ejs')
}
module.exports.registerPost = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, e => {
            if (e) return next(e);
            else {
                res.locals.user = req.user;
                console.log(req.user)
                req.flash('success', "You have registered successfully");
                res.redirect('/maketourList');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}
module.exports.login = (req, res) => {
    res.locals.user = req.user;
    res.render('User/login.ejs')
}
module.exports.loginPost = (req, res) => {
    req.flash('success', "logged in successfully !!")
    const Url = res.locals.pastUrl || '/maketourList';
    delete req.session.pastUrl;
    res.redirect(`${Url}`);
}
module.exports.logout = (req, res) => {
    req.logout(function (e) {
        if (e) return next(e);
        req.flash('success', "You have been successfully logged out !!");
        res.redirect('/maketourList');
    });
}