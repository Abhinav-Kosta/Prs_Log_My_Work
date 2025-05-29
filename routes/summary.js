const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const publicationsController = require("../controllers/publications.js");
const academicController = require("../controllers/academic.js");
const awardController = require("../controllers/award.js");
const bookController = require("../controllers/book.js");
const patentController = require("../controllers/patent.js");
const projectController = require("../controllers/project.js");

// ------Publications------
// View publications by department
router.get("/publications/department/:department", wrapAsync(publicationsController.summaryIndex));

// View publications school-wide
router.get("/publications/school", wrapAsync(publicationsController.summaryIndex));

// View publications by faculty
router.get("/publications/:userId", wrapAsync(publicationsController.summaryIndex));
//-------------------------------------------------------------------------------------

// ---- Academic Events ----
// Department-wide view
router.get("/academic-events/department/:department", wrapAsync(academicController.summaryIndex));

// School-wide view
router.get("/academic-events/school", wrapAsync(academicController.summaryIndex));

// Faculty-specific view
router.get("/academic-events/:userId", wrapAsync(academicController.summaryIndex));
//--------------------------------------------------------------------------------------

// ---- Awards ----
// Department-wide view
router.get("/awards/department/:department", wrapAsync(awardController.summaryIndex));

// School-wide view
router.get("/awards/school", wrapAsync(awardController.summaryIndex));

// Faculty-specific view
router.get("/awards/:userId", wrapAsync(awardController.summaryIndex));
//--------------------------------------------------------------------------------------

// ---- Books ----
// Department-wide view
router.get("/books/department/:department", wrapAsync(bookController.summaryIndex));

// School-wide view
router.get("/books/school", wrapAsync(bookController.summaryIndex));

// Faculty-specific view
router.get("/books/:userId", wrapAsync(bookController.summaryIndex));
//--------------------------------------------------------------------------------------

// ---- Patents ----
// Department-wide view
router.get("/patents/department/:department", wrapAsync(patentController.summaryIndex));

// School-wide view
router.get("/patents/school", wrapAsync(patentController.summaryIndex));

// Faculty-specific view
router.get("/patents/:userId", wrapAsync(patentController.summaryIndex));
//--------------------------------------------------------------------------------------

// ---- Projects ----
// Department-wide view
router.get("/projects/department/:department", wrapAsync(projectController.summaryIndex));

// School-wide view
router.get("/projects/school", wrapAsync(projectController.summaryIndex));

// Faculty-specific view
router.get("/projects/:userId", wrapAsync(projectController.summaryIndex));
//--------------------------------------------------------------------------------------

module.exports = router;