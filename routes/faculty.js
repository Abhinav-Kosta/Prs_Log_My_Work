const express = require('express');
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync.js");

const facultyController = require("../controllers/faculty.js")
const publicationsController = require("../controllers/publications.js");
const academicController = require("../controllers/academic.js");
const awardController = require("../controllers/award.js");
const bookController = require("../controllers/book.js");
const patentController = require("../controllers/patent.js");
const projectController = require("../controllers/project.js");

const { isLoggedIn, 
    isOwner, 
    validatePatent, 
    validatePublication, 
    validateAcademic,
    validateBook,
    validateAward,
    validateProject
        } = require("../middleware.js");

router.get("/new", (req, res) => {
    res.render("record.ejs");
})

router.get("/dashboard", wrapAsync(facultyController.dashboard));

router.get("/publications/new", wrapAsync(publicationsController.renderNew));
router.get("/publications/:userId/:pubId", wrapAsync(publicationsController.show));
router.get("/publications/:userId", wrapAsync(publicationsController.index));
router.post("/publications", isLoggedIn, upload.single('proof'), validatePublication, wrapAsync(publicationsController.create));

router.get("/academic-events/new", wrapAsync(academicController.renderNew));
router.get("/academic-events/:userId/:acdId", wrapAsync(academicController.show));
router.get("/academic-events/:userId", wrapAsync(academicController.index));
router.post("/academic-events", isLoggedIn, upload.single('proof'), validateAcademic, wrapAsync(academicController.create));

router.get("/awards/new", wrapAsync(awardController.renderNew));
router.get("/awards/:userId/:awdId", wrapAsync(awardController.show));
router.get("/awards/:userId", wrapAsync(awardController.index));
router.post("/awards", isLoggedIn, upload.single('proof'), validateAward, wrapAsync(awardController.create));

router.get("/books/new", wrapAsync(bookController.renderNew));
router.get("/books/:userId/:bookId", wrapAsync(bookController.show));
router.get("/books/:userId", wrapAsync(bookController.index));
router.post("/books", isLoggedIn, upload.single('proof'), validateBook, wrapAsync(bookController.create));

router.get("/patents/new", wrapAsync(patentController.renderNew));
router.get("/patents/:userId/:patId", wrapAsync(patentController.show));
router.get("/patents/:userId", wrapAsync(patentController.index));
router.post("/patents", isLoggedIn, upload.single('proof'), validatePatent, wrapAsync(patentController.create));

router.get("/projects/new", wrapAsync(projectController.renderNew));
router.get("/projects/:userId/:pjtId", wrapAsync(projectController.show));
router.get("/projects/:userId", wrapAsync(projectController.index));
router.post("/projects", isLoggedIn, upload.single('proof'), validateProject, wrapAsync(projectController.create));

module.exports = router;