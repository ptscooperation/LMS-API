const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    type: Date,
    required: true,
  },
  student_phone_number: {
    type: String,
    required: true,
  },
  student_email: {
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
  student_password: {
    type: String,
    required: true,
    minLength: 7,
  },
  student_uid: {
    type: String,
    required: true,
    unique: true,
  },
  student_class: [
    {
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

StudentSchema.pre("save", async function (next) {
  // Hash the password before saving the student model
  const student = this;
  if (student.isModified("student_password")) {
    student.student_password = await bcrypt.hash(student.student_password, 8);
  }
  next();
});

StudentSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the student
  const student = this;
  //  const token = jwt.sign({ _id: student._id }, process.env.JWT_KEY);
  const token = jwt.sign(
    { _id: student._id },
    //{ expiresIn: "30s" },
    process.env.JWT_KEY
  );
  student.tokens = student.tokens.concat({ token });
  await student.save();
  return token;
};

StudentSchema.statics.findByCredentials = async (
  student_email,
  student_password
) => {
  // Search for a student by email and password.
  const student = await Student.findOne({ student_email });
  if (!student) {
    throw new Error("Invalid login credentials");
  }
  const isPasswordMatch = await bcrypt.compare(
    student_password,
    student.student_password
  );
  if (!isPasswordMatch) {
    throw new Error("Invalid login credentials");
  }
  return student;
};

// const student = mongoose.model("student", StudentSchema);

// module.exports = student;
const Student = mongoose.model("student", StudentSchema);
module.exports = Student;
