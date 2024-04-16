const User = require("../models/user");

module.exports.rendersignupform = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const register = await User.register(newuser, password);
        console.log(register);
        req.login(register, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome TO Wanderlust");
            res.redirect("/listing");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.rederloginform = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome TO Wanderlust");
    let redirecturl = res.locals.redirectUrl || "/listing";
    res.redirect(redirecturl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listing");
    });
};
