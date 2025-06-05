const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  awardTitle: {
    type: String,
    required: true
  },
  awardingAgency: {
    type: String,
    required: true
  },
  awardDetails: {
    type: String,
    enum: ['Certificate', 'Memento', 'Cash Prize', 'Other'],
    required: true
  },
  proof: {
    url: String,        // Cloudinary secure URL
    filename: String    // Cloudinary public_id or original filename
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Award', awardSchema);