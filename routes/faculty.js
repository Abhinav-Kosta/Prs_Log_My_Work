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
    isPatentOwner,
    isPublicationOwner, 
    isAcademicOwner,
    isBookOwner,
    isAwardOwner,
    isProjectOwner,
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
router.get("/publications/:pubId/edit", wrapAsync(publicationsController.renderEdit));
router.get("/publications/:userId/:pubId", wrapAsync(publicationsController.show));
router.get("/publications/:userId", wrapAsync(publicationsController.index));
router.post("/publications", isLoggedIn, upload.single('proof'), validatePublication, wrapAsync(publicationsController.create));
router.put("/publications/:pubId", isLoggedIn, isPublicationOwner,  upload.single('proof'), validatePublication, wrapAsync(publicationsController.update));
router.delete("/publications/:pubId", isLoggedIn, isPublicationOwner, wrapAsync(publicationsController.destroy));

router.get("/academic-events/new", wrapAsync(academicController.renderNew));
router.get("/academic-events/:acdId/edit", wrapAsync(academicController.renderEdit));
router.get("/academic-events/:userId/:acdId", wrapAsync(academicController.show));
router.get("/academic-events/:userId", wrapAsync(academicController.index));
router.post("/academic-events", isLoggedIn, upload.single('proof'), validateAcademic, wrapAsync(academicController.create));
router.put("/academic-events/:acdId", isLoggedIn, isAcademicOwner, upload.single('proof'), validateAcademic, wrapAsync(academicController.update));
router.delete("/academic-events/:acdId", isLoggedIn, isAcademicOwner, wrapAsync(academicController.destroy));

router.get("/awards/new", wrapAsync(awardController.renderNew));
router.get("/awards/:awdId/edit", wrapAsync(awardController.renderEdit));
router.get("/awards/:userId/:awdId", wrapAsync(awardController.show));
router.get("/awards/:userId", wrapAsync(awardController.index));
router.post("/awards", isLoggedIn, upload.single('proof'), validateAward, wrapAsync(awardController.create));
router.put("/awards/:awdId", isLoggedIn, isAwardOwner, upload.single('proof'), validateAward, wrapAsync(awardController.update));
router.delete("/awards/:awdId", isLoggedIn, isAwardOwner, wrapAsync(awardController.destroy));

router.get("/books/new", wrapAsync(bookController.renderNew));
router.get("/books/:bookId/edit", wrapAsync(bookController.renderEdit));
router.get("/books/:userId/:bookId", wrapAsync(bookController.show));
router.get("/books/:userId", wrapAsync(bookController.index));
router.post("/books", isLoggedIn, upload.single('proof'), validateBook, wrapAsync(bookController.create));
router.put("/books/:bookId", isLoggedIn, isBookOwner, upload.single('proof'), validateBook, wrapAsync(bookController.update));
router.delete("/books/:bookId", isLoggedIn, isBookOwner, wrapAsync(bookController.destroy));

router.get("/patents/new", wrapAsync(patentController.renderNew));
router.get("/patents/:userId", wrapAsync(patentController.index));
router.get("/patents/:patentId/edit", wrapAsync(patentController.renderEdit));
router.get("/patents/:userId/:patId", wrapAsync(patentController.show));
router.post("/patents", isLoggedIn, upload.single('proof'), validatePatent, wrapAsync(patentController.create));
router.put("/patents/:patId", isLoggedIn, isPatentOwner, upload.single('proof'), validatePatent, wrapAsync(patentController.update));
router.delete("/patents/:patId", isLoggedIn, isPatentOwner, wrapAsync(patentController.destroy));

router.get("/projects/new", wrapAsync(projectController.renderNew));
router.get("/projects/:pjtId/edit", wrapAsync(projectController.renderEdit));
router.get("/projects/:userId/:pjtId", wrapAsync(projectController.show));
router.get("/projects/:userId", wrapAsync(projectController.index));
router.post("/projects", isLoggedIn, upload.single('proof'), validateProject, wrapAsync(projectController.create));
router.put("/projects/:pjtId", isLoggedIn, isProjectOwner, upload.single('proof'), validateProject, wrapAsync(projectController.update));
router.delete("/projects/:pjtId", isLoggedIn, isProjectOwner, wrapAsync(projectController.destroy));

module.exports = router;