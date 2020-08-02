const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  teacher_name: {
    type: String,
    required: true,
  },
  institute_name: {
    type: String,
  },
  teacher_phone_number: {
    type: String,
    required: true,
  },
  teacher_email: {
    type: String,
    required: true,
  },
  teacher_payday: {
    type: Date,
    default: Date.now,
  },
  // teacher_uid: {
  //   type: String,
  //   required: true,
  // },
  teacher_class: [
    {
      class_uid: String,
    },
  ],
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Teacher = mongoose.model("teacher", TeacherSchema);
