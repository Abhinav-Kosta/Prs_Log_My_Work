const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Journal", "Conference"],
    required: true,
  },
  articleType: {
    type: String,
    enum: ["Research Paper", "Review Paper"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  authorType: {
    type: String,
    enum: ["First", "Corresponding", "First & Corresponding", "Other"],
    required: true,
  },
  otherAuthorType: {
    type: String
  },
  coAuthors: {
    type: String, // store as comma-separated or a formatted string
    default: ""
  },
  title: {
    type: String,
    required: true
  },
  journalName: {
    type: String,
    required: true
  },
  issnNumber: {
    type: String
  },
  publicationDate: {
    type: Date,
    required: true // So you can sort and filter by month/year
  },
  volume: {
    type: String
  },
  pageNumber: {
    type: String
  },
  indexedIn: {
    type: String, // e.g. "Scopus", "PubMed", "Other"
    enum: ["Scopus", "SCI/SCI-E", "UGC-CARE", "Other", "None"],
    default: "None"
  },
  otherIndex: {
    type: String
  },
  peerReviewed: {
    type: String,
    enum: ["Yes", "No"],
    required: true,
  },
  affiliatedAmity: {
    type: String,
    enum: ["Yes", "No"],
    required: true
  },
  link: {
    type: String,
    required: true,
  },
  impactFactor: {
    type: Number
  },
  proof: {
    url: String,        // Cloudinary secure URL
    filename: String    // Cloudinary public_id or original filename
  }
});

module.exports = mongoose.model('Publication', publicationSchema);