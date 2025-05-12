const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const adminController = require("../controllers/admin.js");

router.get("/dashboard", wrapAsync(adminController.dashboard));

module.exports = router;