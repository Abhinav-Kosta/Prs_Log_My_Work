const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");

router.get("/", (req, res) => {
    res.redirect("/login/faculty");
});

router.get("/new", (req, res) => {
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to view this page!");
        return res.redirect("/login/faculty");
    }
    res.render("record.ejs");
})

// All 3 login routes
router.get("/login/:role", userController.renderLogin);

// Unified login POST route with role check
router.post("/login/:role", userController.verifyRoleAndLogin);

router.get("/logout", userController.logOut)

module.exports = router;