const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isHOIOrAdmin } = require("../middleware.js");

const passController = require("../controllers/changePassword.js");

router.get("/", wrapAsync(passController.renderEdit));

router.post("/", isLoggedIn, wrapAsync(passController.updateIndividual));

router.post("/faculty", isLoggedIn, isHOIOrAdmin, wrapAsync(passController.updateFaculty));

router.post("/hoi", isLoggedIn, isHOIOrAdmin, wrapAsync(passController.updateHoi));

module.exports = router;