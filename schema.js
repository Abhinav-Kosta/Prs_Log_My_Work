const Joi = require("joi");

module.exports.patentSchema = Joi.object({
  title: Joi.string().required(),
  type: Joi.string().valid("National", "International").required(),
  patentFileNo: Joi.string().required(),
  applicationNo: Joi.string().required(),
  dateOfFiling: Joi.date().required(),
  specificationType: Joi.string().valid("Provisional", "Complete", "Other").required(),
  otherSpec: Joi.string().allow(''),
  remarks: Joi.string().valid("Applied", "Awarded", "Published", "Granted", "Other").required(),
  otherRemark: Joi.string().allow(''),
  proof: Joi.any()
});

module.exports.publicationSchema = Joi.object({
  title: Joi.string().required(),
  coAuthors: Joi.string().allow(''), // optional, can be empty string or comma-separated
  journalName: Joi.string().required(),
  issnNumber: Joi.string().allow(''), // optional
  publicationDate: Joi.date().required(),
  volume: Joi.string().allow(''), // optional
  pageNumber: Joi.string().allow(''), // optional
  indexedIn: Joi.string().valid("Scopus", "PubMed", "Medline", "Other", "None").required(),
  otherIndex: Joi.string().allow(''),
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
  title: Joi.string().required(),
  publicationDate: Joi.date().required(),
  isbn: Joi.string().required(),
  publisher: Joi.string().required(),
  proof: Joi.any()
});

module.exports.awardSchema = Joi.object({
  date: Joi.date().required(),
  awardTitle: Joi.string().required(),
  awardingAgency: Joi.string().required(),
  awardDetails: Joi.string().valid("Certificate", "Memento", "Cash Prize", "Other"),
  otherDetail: Joi.string().allow(''),
  proof: Joi.any()
}); 

module.exports.projectSchema = Joi.object({
  title: Joi.string().required(),
  piOrCoPi: Joi.string().valid("PI", "Co-PI", "Other").required(),
  otherRole: Joi.string().allow(''),
  fundingAgency: Joi.string().required(),
  dateOfSubmission: Joi.date().required(),
  fundRequestedLacs: Joi.number().required(),
  durationYears: Joi.number().required(),
  remarks: Joi.string().allow(''),
  proof: Joi.any()
})