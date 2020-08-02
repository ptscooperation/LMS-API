const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  student_name: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  bod: {
    type: String,
    required: true,
  },
  student_phone_number: {
    type: String,
    required: true,
  },
  student_email: {
    type: String,
    required: true,
  },
  student_uid: {
    type: String,
    required: true,
  },
  student_class: [{
    type: String
  }],
  updated_date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Student = mongoose.model("student", StudentSchema);
