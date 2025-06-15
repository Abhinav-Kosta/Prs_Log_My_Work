const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  variety: {
    type: String,
    enum: ['Patent', 'Copyright'],
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["National", "International", "Other"],
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
    enum: ["Provisional", "Complete", "Other"],
    required: true
  },
  otherSpec : {
    type: String,
  },
  remarks: {
    type: String,
    enum: ["Filed", "Awarded", "Published", "Granted", "Other"],
    required: true
  },
  otherRemark: {
    type: String,
  },
  affiliatedAmity: {
    type: String,
    enum: ["Yes", "No"],
    required: true
  },
  proof: {
    url: String,        // Cloudinary secure URL
    filename: String    // Cloudinary public_id or original filename
  }
});

module.exports = mongoose.model('Patent', patentSchema);