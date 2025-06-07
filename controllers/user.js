const passport = require("passport");

const redirectMap = {
    faculty: "/faculty/dashboard",
    admin: "/admin/dashboard",
    hoi: "/hoi/dashboard"
};

module.exports.renderLogin = (req, res) => {
    const { role } = req.params;
    const validRoles = ["faculty", "admin", "hoi"];
    if (!validRoles.includes(role)) {
        req.flash("error", "Invalid login role.");
        return res.redirect("/login/faculty");
    }
    res.render("users/login.ejs", { role }); // send role to view
};

module.exports.verifyRoleAndLogin = (req, res, next) => {
    const { role } = req.params;

    // console.log(req.body);

    passport.authenticate("local", {
        usernameField: "facultyId", // This tells Passport to look at req.body.facultyId
        failureFlash: true,
        failureRedirect: `/login/${role}`
    }, (err, user, info) => {
        if (err || !user) {
            req.flash("error", "Invalid credentials.");
            return res.redirect(`/login/${role}`);
        }

        if (user.role !== role) {
            req.flash("error", `Access denied for ${user.role}. Login through this page.`);
            return res.redirect(`/login/${user.role}`);
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            req.flash("success", `Welcome back ${user.fullname}!`);
            return res.redirect(redirectMap[role]);
        });
    })(req, res, next);
};

module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "logged out successfully!");
        res.redirect("/login/faculty");
    })
}