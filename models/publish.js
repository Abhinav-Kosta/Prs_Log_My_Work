const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
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
    enum: ["Scopus", "PubMed", "Medline", "Other", "None"],
    default: "None"
  },
  otherIndex: {
    type: String
  },
  link: {
    type: String
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