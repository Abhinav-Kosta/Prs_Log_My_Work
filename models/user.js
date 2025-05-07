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
  }
});

// Add username + hashed password fields
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);