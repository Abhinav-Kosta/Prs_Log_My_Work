const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["National", "International"],
    required: true
  },
  patentFileNo: {
    type: String,
    required: true
  },
  applicationNo: {
    type: String,
    required: true
  },
  dateOfFiling: {
    type: Date,
    required: true // this must be provided manually by the user
  },
  specificationType: {
    type: String,
    enum: ["Provisional", "Complete"],
    required: true
  },
  remarks: {
    type: String,
    enum: ["Applied", "Awarded", "Published", "Under Examination"],
    required: true
  }
});

module.exports = mongoose.model('Patent', patentSchema);