const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String
  },
  designation: {
    type: String,
    required: true
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

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'facultyId',
});

module.exports = mongoose.model('User', userSchema);