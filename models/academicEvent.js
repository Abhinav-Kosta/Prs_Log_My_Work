const mongoose = require('mongoose');

const academicEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Conference', 'Workshop', 'Seminar', 'Symposia', 'FDP'],
    required: true
  },
  titleOfPaperPresented: {
    type: String,
    required: true
  },
  eventName: {
    type: String, // Name of Conference/Workshop/Seminar
    required: true
  },
  sponsoredBy: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  participationType: {
    type: String,
    enum: [
      'Poster Presentation',
      'Oral Presentation',
      'Guest Speaker',
      'Chairman',
      'Co-Chairman',
      'Keynote Speaker',
      'Delegate'
    ],
    required: true
  },
  proof: {
    url: String,        // Cloudinary secure URL
    filename: String    // Cloudinary public_id or original filename
  }
});

module.exports = mongoose.model('AcademicEvent', academicEventSchema);