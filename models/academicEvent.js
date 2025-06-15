const mongoose = require('mongoose');

const academicEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Conference', 'Workshop', 'Seminar', 'Symposia', 'FDP', 'Other'],
    required: true
  },
  otherEvent: {
    type: String
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
      'Organizing Secretary',
      'Attendee',
      'Guest Speaker',
      'Chairman',
      'Co-Chairman',
      'Keynote Speaker',
      'Delegate',
      'Other'
    ],
    required: true
  },
  otherPart: {
    type: String
  },
  affiliatedAmity: {
    type: String,
    enum: ["Yes", "No"],
    required: true
  },
  duration: {
    type: String
  },
  proof: {
    url: String,        // Cloudinary secure URL
    filename: String    // Cloudinary public_id or original filename
  }
});

module.exports = mongoose.model('AcademicEvent', academicEventSchema);