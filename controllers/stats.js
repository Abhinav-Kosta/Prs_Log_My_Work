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
        publicationsCount
        ] = await Promise.all([
        AcademicEvent.countDocuments(dateQuery("date")),
        Award.countDocuments(dateQuery("date")),
        BookChapter.countDocuments(dateQuery("publicationDate")),
        Patent.countDocuments(dateQuery("dateOfFiling")),
        ProjectSubmission.countDocuments(dateQuery("dateOfSubmission")),
        Publication.countDocuments(dateQuery("publicationDate"))
      ]);

    return {
        academicEvents: academicEventsCount,
        awards: awardsCount,
        bookChapters: bookChaptersCount,
        patents: patentsCount,
        projects: projectsCount,
        publications: publicationsCount
    };
};