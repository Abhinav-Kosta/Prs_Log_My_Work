const User = require('../models/user');
const AcademicEvent = require('../models/academicEvent');
const Award = require('../models/award');
const BookChapter = require('../models/bookChapter');
const Patent = require('../models/patent');
const ProjectSubmission = require('../models/projectSubmission');
const Publication = require('../models/publish');
const getDateRange = require('../utils/dateRange.js');

module.exports.getUserStats = async (userId, range = 'all', year, month, quarter, half) => {
    const dateFilter = getDateRange(range, year, month, quarter, half);

    // Build conditional queries
    const dateQuery = (field) => {
      return Object.keys(dateFilter).length > 0
        ? { user: userId, [field]: dateFilter }
        : { user: userId };
    };

    const [
        academicEventsCount,
        awardsCount,
        bookChaptersCount,
        patentsCount,
        projectsCount,
        publicationsCount,
        scopusPublicationsCount
        ] = await Promise.all([
        AcademicEvent.countDocuments(dateQuery("date")),
        Award.countDocuments(dateQuery("date")),
        BookChapter.countDocuments(dateQuery("publicationDate")),
        Patent.countDocuments(dateQuery("dateOfFiling")),
        ProjectSubmission.countDocuments(dateQuery("dateOfSubmission")),
        Publication.countDocuments(dateQuery("publicationDate")),
        Publication.countDocuments({ 
          ...dateQuery("publicationDate"), 
          indexedIn: "Scopus"
        })
      ]);

    return {
        academicEvents: academicEventsCount,
        awards: awardsCount,
        bookChapters: bookChaptersCount,
        patents: patentsCount,
        projects: projectsCount,
        publications: publicationsCount,
        scopusPublications: scopusPublicationsCount
    };
};

module.exports.getHOIStats = async ({
  school,
  scope = 'school',
  department,
  facultyId,
  range = 'all',
  year,
  month,
  quarter,
  half
}) => {
  const dateFilter = getDateRange(range, year, month, quarter, half);

  // Step 1: Determine user filter
  let userFilter = { school };
  if (scope === 'faculty' && facultyId) {
    userFilter = { _id: facultyId };
  } else if (scope === 'department' && department) {
    userFilter = { school, department, role: 'faculty' };
  } else {
    userFilter = { school, role: { $in: ['faculty', 'hoi'] } };
  }

  const users = await User.find(userFilter).select('_id');
  const userIds = users.map(u => u._id);

  // Step 2: Build conditional queries
  const dateQuery = (field) => {
    return Object.keys(dateFilter).length > 0
      ? { user: { $in: userIds }, [field]: dateFilter }
      : { user: { $in: userIds } };
  };

  // Step 3: Build Scopus query separately to avoid conflicts
  const scopusQuery = () => {
    const baseQuery = {
      user: { $in: userIds },
      indexedIn: "Scopus"
    };
    
    if (Object.keys(dateFilter).length > 0) {
      baseQuery.publicationDate = dateFilter;
    }
    
    return baseQuery;
  };

  // Step 4: Count documents
  const [
    academicEventsCount,
    awardsCount,
    bookChaptersCount,
    patentsCount,
    projectsCount,
    publicationsCount,
    scopusPublicationsCount
  ] = await Promise.all([
    AcademicEvent.countDocuments(dateQuery("date")),
    Award.countDocuments(dateQuery("date")),
    BookChapter.countDocuments(dateQuery("publicationDate")),
    Patent.countDocuments(dateQuery("dateOfFiling")),
    ProjectSubmission.countDocuments(dateQuery("dateOfSubmission")),
    Publication.countDocuments(dateQuery("publicationDate")),
    Publication.countDocuments(scopusQuery())
  ]);

  return {
    academicEvents: academicEventsCount,
    awards: awardsCount,
    bookChapters: bookChaptersCount,
    patents: patentsCount,
    projects: projectsCount,
    publications: publicationsCount,
    scopusPublications: scopusPublicationsCount
  };
};