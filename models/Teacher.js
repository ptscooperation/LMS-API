const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TeacherSchema = new mongoose.Schema({
  teacher_name: {
    type: String,
    required: true,
  },
  institute_name: {
    type: String,
    default: "",
  },
  teacher_phone_number: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  teacher_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  teacher_password: {
    type: String,
    required: true,
    minLength: 7,
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
      //class_uid: String,
      type: String,
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

TeacherSchema.pre("save", async function (next) {
  // Hash the password before saving the teacher model
  const teacher = this;
  if (teacher.isModified("teacher_password")) {
    teacher.teacher_password = await bcrypt.hash(teacher.teacher_password, 8);
  }
  next();
});

TeacherSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the teacher
  const teacher = this;
  //  const token = jwt.sign({ _id: teacher._id }, process.env.JWT_KEY);
  const token = jwt.sign(
    { _id: teacher._id },
    //{ expiresIn: "30s" },
    process.env.JWT_KEY
  );
  teacher.tokens = teacher.tokens.concat({ token });
  await teacher.save();
  return token;
};

TeacherSchema.statics.findByCredentials = async (
  teacher_email,
  teacher_password
) => {
  // Search for a teacher by email and password.
  const teacher = await Teacher.findOne({ teacher_email });
  if (!teacher) {
    throw new Error("Invalid login credentials");
  }
  const isPasswordMatch = await bcrypt.compare(
    teacher_password,
    teacher.teacher_password
  );
  if (!isPasswordMatch) {
    throw new Error("Invalid login credentials");
  }
  return teacher;
};

// const teacher = mongoose.model("teacher", TeacherSchema);

// module.exports = teacher;
const Teacher = mongoose.model("teacher", TeacherSchema);
module.exports = Teacher;

//module.exports = Teacher = mongoose.model("teacher", TeacherSchema);
