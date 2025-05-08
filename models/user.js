const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
  },
  role: {
    type: String,
    enum: ["faculty", "hoi", "admin"],
    required: true
  },
  department: {
    type: String,
    required: function () {
      return this.role !== "admin"; // only required for faculty and HOI
    }
  }
});

// Add username + hashed password fields
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);