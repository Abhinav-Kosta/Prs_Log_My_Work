const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const { isAdmin } = require("../middleware.js");

const adminController = require("../controllers/admin.js");

router.get("/dashboard", wrapAsync(adminController.dashboard));

router.get("/signup", wrapAsync(adminController.renderSignup));

router.post("/signup",isAdmin, wrapAsync(adminController.signUp));

module.exports = router;