const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String
  },
  role: {
    type: String,
    enum: ["faculty", "hoi", "admin"],
    required: true
  },
  school: {
    type: String,
    required: function () {
      return this.role === "faculty" || this.role === "hoi";
    }
  },
  department: {
    type: String,
    required: function () {
      return this.role === "faculty";
    }
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);