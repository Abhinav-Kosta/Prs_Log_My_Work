const mongoose = require('mongoose');

const bookChapterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Book', 'Book Chapters'],
    required: true,
  },
  title: {
    type: String,
    required: true // assuming title is essential
  },
  authorType: {
    type: String,
    enum: ["First", "Corresponding", "First & Corresponding", "Other"],
    required: true,
  },
  otherAuthorType: {
    type: String
  },
  publicationDate: {
    type: Date,
    required: true
  },
  isbn: {
    type: String
  },
  publisher: {
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
    type: String
  },
  proof: {
    url: String,        // Cloudinary secure URL
    filename: String    // Cloudinary public_id or original filename
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BookChapter', bookChapterSchema);