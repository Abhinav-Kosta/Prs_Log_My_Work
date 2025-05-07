const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");

router.get("/", (req, res) => {
    res.redirect("/login/faculty");
});

// All 3 login routes
router.get("/login/:role", userController.renderLogin);

// Unified login POST route with role check
router.post("/login/:role", userController.verifyRoleAndLogin);

router.get("/logout", userController.logOut)

module.exports = router;