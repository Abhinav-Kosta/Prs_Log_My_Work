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
router.get("/publications/department/:department/export", wrapAsync(publicationsController.summaryIndexExport));

// View publications school-wide
router.get("/publications/school", wrapAsync(publicationsController.summaryIndex));
router.get("/publications/school/export", wrapAsync(publicationsController.summaryIndexExport));

// View publications by faculty
router.get("/publications/:userId", wrapAsync(publicationsController.summaryIndex));
router.get("/publications/:userId/export", wrapAsync(publicationsController.summaryIndexExport));
//-------------------------------------------------------------------------------------

// ---- Academic Events ----
// Department-wide view
router.get("/academic-events/department/:department", wrapAsync(academicController.summaryIndex));
router.get("/academic-events/department/:department/export", wrapAsync(academicController.summaryIndexExport));

// School-wide view
router.get("/academic-events/school", wrapAsync(academicController.summaryIndex));
router.get("/academic-events/school/export", wrapAsync(academicController.summaryIndexExport));

// Faculty-specific view
router.get("/academic-events/:userId", wrapAsync(academicController.summaryIndex));
router.get("/academic-events/:userId/export", wrapAsync(academicController.summaryIndexExport));
//--------------------------------------------------------------------------------------

// ---- Awards ----
// Department-wide view
router.get("/awards/department/:department", wrapAsync(awardController.summaryIndex));
router.get("/awards/department/:department/export", wrapAsync(awardController.summaryIndexExport));

// School-wide view
router.get("/awards/school", wrapAsync(awardController.summaryIndex));
router.get("/awards/school/export", wrapAsync(awardController.summaryIndexExport));

// Faculty-specific view
router.get("/awards/:userId", wrapAsync(awardController.summaryIndex));
router.get("/awards/:userId/export", wrapAsync(awardController.summaryIndexExport));
//--------------------------------------------------------------------------------------

// ---- Books ----
// Department-wide view
router.get("/books/department/:department", wrapAsync(bookController.summaryIndex));
router.get("/books/department/:department/export", wrapAsync(bookController.summaryIndexExport));

// School-wide view
router.get("/books/school", wrapAsync(bookController.summaryIndex));
router.get("/books/school/export", wrapAsync(bookController.summaryIndexExport));

// Faculty-specific view
router.get("/books/:userId", wrapAsync(bookController.summaryIndex));
router.get("/books/:userId/export", wrapAsync(bookController.summaryIndexExport));
//--------------------------------------------------------------------------------------

// ---- Patents ----
// Department-wide view
router.get("/patents/department/:department", wrapAsync(patentController.summaryIndex));
router.get("/patents/department/:department/export", wrapAsync(patentController.summaryIndexExport));

// School-wide view
router.get("/patents/school", wrapAsync(patentController.summaryIndex));
router.get("/patents/school/export", wrapAsync(patentController.summaryIndexExport));

// Faculty-specific view
router.get("/patents/:userId", wrapAsync(patentController.summaryIndex));
router.get("/patents/:userId/export", wrapAsync(patentController.summaryIndexExport));
//--------------------------------------------------------------------------------------

// ---- Projects ----
// Department-wide view
router.get("/projects/department/:department", wrapAsync(projectController.summaryIndex));
router.get("/projects/department/:department/export", wrapAsync(projectController.summaryIndexExport));

// School-wide view
router.get("/projects/school", wrapAsync(projectController.summaryIndex));
router.get("/projects/school/export", wrapAsync(projectController.summaryIndexExport));

// Faculty-specific view
router.get("/projects/:userId", wrapAsync(projectController.summaryIndex));
router.get("/projects/:userId/export", wrapAsync(projectController.summaryIndexExport));
//--------------------------------------------------------------------------------------

module.exports = router;