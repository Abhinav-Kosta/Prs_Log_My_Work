const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const hoiController = require("../controllers/hoi.js");
const publicationsController = require("../controllers/publications.js");
const academicController = require("../controllers/academic.js");
const awardController = require("../controllers/award.js");
const bookController = require("../controllers/book.js");
const patentController = require("../controllers/patent.js");
const projectController = require("../controllers/project.js");

const { isLoggedIn, validatePatent, validatePublication } = require("../middleware.js");

router.get("/new", (req, res) => {
    res.render("record.ejs");
})

router.get("/dashboard", wrapAsync(hoiController.dashboard));

router.get("/publications/new", wrapAsync(publicationsController.renderNew));
router.get("/publications/:userId/:pubId", wrapAsync(publicationsController.show));
router.get("/publications/:userId", wrapAsync(publicationsController.index));
router.post("/publications", isLoggedIn, validatePublication, wrapAsync(publicationsController.create));

router.get("/academic-events/:userId/:acdId", wrapAsync(academicController.show));
router.get("/academic-events/:userId", wrapAsync(academicController.index));

router.get("/awards/:userId/:awdId", wrapAsync(awardController.show));
router.get("/awards/:userId", wrapAsync(awardController.index));

router.get("/books/:userId/:bookId", wrapAsync(bookController.show));
router.get("/books/:userId", wrapAsync(bookController.index));

router.get("/patents/new", wrapAsync(patentController.renderNew));
router.get("/patents/:userId/:patId", wrapAsync(patentController.show));
router.get("/patents/:userId", wrapAsync(patentController.index));
router.post("/patents", isLoggedIn, validatePatent, wrapAsync(patentController.create));

router.get("/projects/:userId/:pjtId", wrapAsync(projectController.show));
router.get("/projects/:userId", wrapAsync(projectController.index));

module.exports = router;