const mongoose = require('mongoose');

const bookChapterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true // assuming title is essential
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
  proof: {
    url: String,        // Cloudinary secure URL
    filename: String    // Cloudinary public_id or original filename
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BookChapter', bookChapterSchema);