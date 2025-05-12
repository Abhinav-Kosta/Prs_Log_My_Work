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

router.get("/dashboard", wrapAsync(hoiController.dashboard));

router.get("/publications/:userId/:pubId", wrapAsync(publicationsController.show));
router.get("/publications/:userId", wrapAsync(publicationsController.index));

router.get("/academic-events/:userId/:acdId", wrapAsync(academicController.show));
router.get("/academic-events/:userId", wrapAsync(academicController.index));

router.get("/awards/:userId/:awdId", wrapAsync(awardController.show));
router.get("/awards/:userId", wrapAsync(awardController.index));

router.get("/books/:userId/:bookId", wrapAsync(bookController.show));
router.get("/books/:userId", wrapAsync(bookController.index));

router.get("/patents/:userId/:patId", wrapAsync(patentController.show));
router.get("/patents/:userId", wrapAsync(patentController.index));

router.get("/projects/:userId/:pjtId", wrapAsync(projectController.show));
router.get("/projects/:userId", wrapAsync(projectController.index));

module.exports = router;