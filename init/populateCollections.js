// populateCollections.js
const mongoose = require("mongoose");
const User = require("../models/user.js");
const AcademicEvent = require("../models/academicEvent.js");
const Award = require("../models/award.js");
const BookChapter = require("../models/bookChapter.js");
const Patent = require("../models/patent.js");
const ProjectSubmission = require("../models/projectSubmission.js");
const Publication = require("../models/publish.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/faculty2";

// Helper function to get random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const getSchoolSpecificData = (user) => {
  const isALS = user.school === "ALS";
  
  return {
    techAreas: isALS 
      ? ['Legal Tech', 'IP Law', 'Human Rights', 'Corporate Law', 'Criminal Reform']
      : ['AI', 'IoT', 'Blockchain', 'Robotics', 'Biotech'],
    projectTypes: isALS
      ? ['Legal Framework', 'Policy Analysis', 'Judicial Reform', 'Comparative Study']
      : ['Application', 'Framework', 'System', 'Model'],
    academicTopics: isALS
      ? ['Judicial', 'Legislative', 'Human Rights', 'Corporate']
      : ['Tech', 'Science', 'Engineering', 'Research'],
    publicationTopics: isALS
      ? ['Constitutional Law', 'International Law', 'Human Rights', 'Corporate Governance']
      : ['AI', 'ML', 'Blockchain', 'IoT', 'Cloud Computing'],
    bookTopics: isALS
      ? ['Legal Principles', 'Case Studies', 'Jurisprudence', 'Legislative Analysis']
      : ['AI', 'Machine Learning', 'Data Science', 'Blockchain', 'Cybersecurity']
  };
};

// Demo data generators for each collection
const academicEventData = (user) => {
  const { academicTopics } = getSchoolSpecificData(user);
  const types = ['Conference', 'Workshop', 'Seminar', 'Symposia', 'FDP'];
  const participationTypes = [
    'Poster Presentation', 
    'Oral Presentation', 
    'Guest Speaker', 
    'Chairman', 
    'Co-Chairman', 
    'Keynote Speaker', 
    'Delegate'
  ];
  const sponsors = ['IEEE', 'ACM', 'Springer', 'Elsevier', 'National Science Foundation', 'Department of Education'];
  const venues = ['New York', 'London', 'Tokyo', 'Bangalore', 'Virtual'];

  return {
    user: user._id,
    type: types[Math.floor(Math.random() * types.length)],
    titleOfPaperPresented: `Paper on ${academicTopics[Math.floor(Math.random() * academicTopics.length)]}`,
    eventName: `International ${academicTopics[Math.floor(Math.random() * academicTopics.length)]} ${types[Math.floor(Math.random() * types.length)]}`,
    sponsoredBy: sponsors[Math.floor(Math.random() * sponsors.length)],
    date: randomDate(new Date(2018, 0, 1), new Date()),
    venue: venues[Math.floor(Math.random() * venues.length)],
    participationType: participationTypes[Math.floor(Math.random() * participationTypes.length)]
  };
};

const awardData = (user) => {
  const awards = ['Best Paper', 'Outstanding Researcher', 'Teaching Excellence', 'Innovation Award', 'Young Scientist'];
  const agencies = ['University', 'IEEE', 'ACM', 'Government', 'Industry Partner'];
  const details = ['Certificate', 'Memento', 'Cash Prize', 'Other'];

  return {
    user: user._id,
    date: randomDate(new Date(2018, 0, 1), new Date()),
    awardTitle: awards[Math.floor(Math.random() * awards.length)],
    awardingAgency: agencies[Math.floor(Math.random() * agencies.length)],
    awardDetails: details[Math.floor(Math.random() * details.length)]
  };
};

const bookChapterData = (user) => {
  const { bookTopics } = getSchoolSpecificData(user);
  const publishers = ['Springer', 'Elsevier', 'Wiley', 'CRC Press', 'McGraw-Hill'];

  return {
    user: user._id,
    title: `Chapter on ${bookTopics[Math.floor(Math.random() * bookTopics.length)]}`,
    publicationDate: randomDate(new Date(2018, 0, 1), new Date()),
    isbn: `978-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10)}`,
    publisher: publishers[Math.floor(Math.random() * publishers.length)]
  };
};

const patentData = (user) => {
  const { techAreas } = getSchoolSpecificData(user);
  const types = ["National", "International"];
  const specs = ["Provisional", "Complete"];
  const remarks = ["Applied", "Awarded", "Published", "Under Examination"];

  return {
    user: user._id,
    title: `Patent for ${techAreas[Math.floor(Math.random() * techAreas.length)]} ${['Device', 'Method', 'System', 'Process'][Math.floor(Math.random() * 4)]}`,
    type: types[Math.floor(Math.random() * types.length)],
    patentFileNo: `PF${Math.floor(Math.random() * 10000)}`,
    applicationNo: `APP${Math.floor(Math.random() * 100000)}`,
    dateOfFiling: randomDate(new Date(2018, 0, 1), new Date()),
    specificationType: specs[Math.floor(Math.random() * specs.length)],
    remarks: remarks[Math.floor(Math.random() * remarks.length)]
  };
};

const projectSubmissionData = (user) => {
  const { techAreas, projectTypes } = getSchoolSpecificData(user);
  const agencies = ['DST', 'UGC', 'AICTE', 'DRDO', 'ISRO', 'Industry Partner'];

  return {
    user: user._id,
    title: `Project on ${techAreas[Math.floor(Math.random() * techAreas.length)]} ${projectTypes[Math.floor(Math.random() * projectTypes.length)]}`,
    piOrCoPi: Math.random() > 0.5 ? 'PI' : 'Co-PI',
    fundingAgency: agencies[Math.floor(Math.random() * agencies.length)],
    dateOfSubmission: randomDate(new Date(2018, 0, 1), new Date()),
    fundRequestedLacs: (Math.random() * 50 + 5).toFixed(2),
    durationYears: Math.floor(Math.random() * 5) + 1,
    remarks: ['Pending', 'Approved', 'Rejected', 'Under Review'][Math.floor(Math.random() * 4)]
  };
};

const publicationData = (user) => {
  const journals = ['IEEE Transactions', 'Springer Journal', 'Elsevier Journal', 'ACM Journal', 'Nature'];
  const indexes = ["Scopus", "PubMed", "Medline", "Other", "None"];
  const { publicationTopics } = getSchoolSpecificData(user);

  return {
    user: user._id,
    coAuthors: `Co-author ${Math.floor(Math.random() * 5) + 1}, Co-author ${Math.floor(Math.random() * 5) + 1}`,
    title: `Research on ${publicationTopics[Math.floor(Math.random() * publicationTopics.length)]} ${['Applications', 'Methods', 'Systems', 'Frameworks'][Math.floor(Math.random() * 4)]}`,
    journalName: `${journals[Math.floor(Math.random() * journals.length)]} on ${publicationTopics[Math.floor(Math.random() * publicationTopics.length)]}`,
    issnNumber: `ISSN ${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 1000)}`,
    publicationDate: randomDate(new Date(2018, 0, 1), new Date()),
    volume: `Vol. ${Math.floor(Math.random() * 20) + 1}`,
    pageNumber: `${Math.floor(Math.random() * 500) + 1}-${Math.floor(Math.random() * 500) + 501}`,
    indexedIn: indexes[Math.floor(Math.random() * indexes.length)],
    link: 'https://example.com/publication',
    impactFactor: (Math.random() * 10).toFixed(2)
  };
};

// Main function to populate collections
const populateCollections = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected successfully");

    // Get all users
    const users = await User.find({});
    
    // Clear all collections except Users
    await AcademicEvent.deleteMany({});
    await Award.deleteMany({});
    await BookChapter.deleteMany({});
    await Patent.deleteMany({});
    await ProjectSubmission.deleteMany({});
    await Publication.deleteMany({});
    console.log("Existing data cleared from collections");

    // For each user, create random number of documents in each collection
    for (const user of users) {

      // Create 1-5 documents for each collection per user
      const academicEventCount = Math.floor(Math.random() * 5) + 1;
      const awardCount = Math.floor(Math.random() * 3) + 1;
      const bookChapterCount = Math.floor(Math.random() * 4) + 1;
      const patentCount = Math.floor(Math.random() * 2) + 1;
      const projectCount = Math.floor(Math.random() * 3) + 1;
      const publicationCount = Math.floor(Math.random() * 6) + 1;

      // Create academic events
      for (let i = 0; i < academicEventCount; i++) {
        await AcademicEvent.create(academicEventData(user));
      }

      // Create awards
      for (let i = 0; i < awardCount; i++) {
        await Award.create(awardData(user));
      }

      // Create book chapters
      for (let i = 0; i < bookChapterCount; i++) {
        await BookChapter.create(bookChapterData(user));
      }

      // Create patents
      for (let i = 0; i < patentCount; i++) {
        await Patent.create(patentData(user));
      }

      // Create project submissions
      for (let i = 0; i < projectCount; i++) {
        await ProjectSubmission.create(projectSubmissionData(user));
      }

      // Create publications
      for (let i = 0; i < publicationCount; i++) {
        await Publication.create(publicationData(user));
      }

      console.log(`Created data for user ${user.facultyId}`);
    }

    console.log("All collections populated successfully!");
  } catch (error) {
    console.error("Error populating collections:", error);
  } finally {
    mongoose.connection.close();
  }
};

populateCollections();