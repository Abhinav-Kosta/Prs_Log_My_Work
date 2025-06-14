const Joi = require("joi");

module.exports.editUserSchema = Joi.object({
  fullname: Joi.string().required(),
  designation: Joi.string().required(),
  school: Joi.when('role', {
    is: Joi.valid('faculty', 'hoi'),
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  }),
  department: Joi.when('role', {
    is: 'faculty',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  }),
  dateOfJoining: Joi.date().required(),
  // facultyId is readonly on the frontend and not expected to be changed, but you can still allow it for internal consistency
  facultyId: Joi.string().required(),
  role: Joi.string().valid('faculty', 'hoi', 'admin').required()
});

module.exports.patentSchema = Joi.object({
  variety: Joi.string().valid("Patent", "Copyright").required(),
  title: Joi.string().required(),
  type: Joi.string().valid("National", "International").required(),
  patentFileNo: Joi.string().required(),
  applicationNo: Joi.string().required(),
  dateOfFiling: Joi.date().required(),
  specificationType: Joi.string().valid("Provisional", "Complete", "Other").required(),
  otherSpec: Joi.string().allow(''),
  remarks: Joi.string().valid("Filed", "Awarded", "Published", "Granted", "Other").required(),
  otherRemark: Joi.string().allow(''),
  proof: Joi.any()
});

module.exports.publicationSchema = Joi.object({
  type: Joi.string().valid("Journal", "Conference").required(),
  articleType: Joi.string().valid("Research Paper", "Review Paper").required(),
  title: Joi.string().required(),
  authorType: Joi.string().valid("First", "Corresponding", "First & Corresponding", "Other").required(),
  otherAuthorType: Joi.string().allow(''),
  coAuthors: Joi.string().allow(''), // optional, can be empty string or comma-separated
  journalName: Joi.string().required(),
  issnNumber: Joi.string().allow(''), // optional
  publicationDate: Joi.date().required(),
  volume: Joi.string().allow(''), // optional
  pageNumber: Joi.string().allow(''), // optional
  indexedIn: Joi.string().valid("Scopus", "SCI/SCI-E", "UGC-CARE", "Other", "None").required(),
  otherIndex: Joi.string().allow(''),
  peerReviewed: Joi.string().valid("Yes", "No").required(),
  affiliatedAmity: Joi.string().valid("Yes", "No"). required(),
  link: Joi.string().uri().allow(''), // optional, must be valid URL if provided
  impactFactor: Joi.number().min(0).allow(null), // optional, can be null or a non-negative number
  proof: Joi.any()
});

module.exports.academicSchema = Joi.object({
  titleOfPaperPresented: Joi.string().required(),
  type: Joi.string().valid("Conference", "Workshop", "Seminar", "Symposia", "FDP", "Other").required(),
  eventName: Joi.string().required(),
  otherEvent: Joi.string().allow(''),
  sponsoredBy: Joi.string().required(),
  date: Joi.date().required(),
  venue: Joi.string().required(),
  participationType: Joi.string().valid(
      "Organizing Secretary",
      "Attendee",
      "Guest Speaker",
      "Chairman",
      "Co-Chairman",
      "Keynote Speaker",
      "Delegate",
      "Other"
    ).required(),
  otherPart: Joi.string().allow(''),
  duration: Joi.string().required(),
  proof: Joi.any()
});

module.exports.bookSchema = Joi.object({
  type: Joi.string().valid("Book", "Book Chapters").required(),
  title: Joi.string().required(),
  authorType: Joi.string().valid("First", "Corresponding", "First & Corresponding", "Other").required(),
  otherAuthorType: Joi.string().allow(''),
  publicationDate: Joi.date().required(),
  isbn: Joi.string().required(),
  publisher: Joi.string().required(),
  peerReviewed: Joi.string().valid("Yes", "No").required(),
  affiliatedAmity: Joi.string().valid("Yes", "No"). required(),
  link: Joi.string().uri().required(),
  proof: Joi.any()
});

module.exports.awardSchema = Joi.object({
  date: Joi.date().required(),
  awardTitle: Joi.string().required(),
  awardingAgency: Joi.string().required(),
  awardDetails: Joi.string().valid(
    "Certificate", 
    "Memento", 
    "Cash Prize", 
    "Travel Grant",
    "Fellowship", 
    "International Visit",
    "Best Paper Award",
    "Other",
  ),
  otherDetail: Joi.string().allow(''),
  affiliatedAmity: Joi.string().valid("Yes", "No"). required(),
  proof: Joi.any()
}); 

module.exports.projectSchema = Joi.object({
  title: Joi.string().required(),
  type: Joi.string().valid("Project", "Consultancies").required(),
  piOrCoPi: Joi.string().valid("PI", "Co-PI", "Other").required(),
  otherRole: Joi.string().allow(''),
  fundingAgency: Joi.string().required(),
  dateOfSubmission: Joi.date().required(),
  fundRequestedLacs: Joi.number().required(),
  durationYears: Joi.number().required(),
  remarks: Joi.string().allow(''),
  proof: Joi.any()
})