const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  class_date: {
    type: String,
    required: true,
  },
  class_time: {
    type: String,
    required: true,
  },
  teacher_name: {
    type: String,
    required: true,
  },
  institute_name: {
    type: String,
  },
  // class_uid: {
  //   type: String,
  //   required: true,
  // },
  student_list: [
    {
      student_uid: { type: String },
      student_payday: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  post_list: [
    {
      type: String,
    },
  ],
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Class = mongoose.model("class", ClassSchema);
