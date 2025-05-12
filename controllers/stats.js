const AcademicEvent = require('../models/academicEvent');
const Award = require('../models/award');
const BookChapter = require('../models/bookChapter');
const Patent = require('../models/patent');
const ProjectSubmission = require('../models/projectSubmission');
const Publication = require('../models/publish');

module.exports.getUserStats = async (userId) => {
    const [
        academicEventsCount,
        awardsCount,
        bookChaptersCount,
        patentsCount,
        projectsCount,
        publicationsCount
        ] = await Promise.all([
            AcademicEvent.countDocuments({ user: userId }),
            Award.countDocuments({ user: userId }),
            BookChapter.countDocuments({ user: userId }),
            Patent.countDocuments({ user: userId }),
            ProjectSubmission.countDocuments({ user: userId }),
            Publication.countDocuments({ user: userId })
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