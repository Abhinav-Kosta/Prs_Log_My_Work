const mongoose = require('mongoose');

const projectSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  piOrCoPi: {
    type: String,
    enum: ['PI', 'Co-PI', 'Other'],
    required: true
  },
  otherRole: {
    type: String,
  },
  fundingAgency: {
    type: String,
    required: true
  },
  dateOfSubmission: {
    type: Date,
    required: true
  },
  fundRequestedLacs: {
    type: Number,
    required: true
  },
  durationYears: {
    type: Number,
    required: true
  },
  remarks: {
    type: String
  },
  proof: {
    url: String,
    filename: String,
  }
});

module.exports = mongoose.model('ProjectSubmission', projectSubmissionSchema);