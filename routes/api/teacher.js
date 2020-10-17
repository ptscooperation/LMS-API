const express = require("express");
const router = express.Router();

// Load Teacher model
const Teacher = require("../../models/Teacher");
const Class = require("../../models/Class");
const Student = require("../../models/Student");
const Post = require("../../models/Post");
const authTeacher = require("../../middleware/authTeacher"); //auth

// @route GET api/teacher/test
// @description tests books route
// @access Public
router.get("/test", (req, res) => res.send("teacher route testing!"));

// @route GET api/teacher/NI/
// @description Get all books
// @access Public
router.get("/NI/:id", authTeacher, (req, res) => {
  Teacher.find(
    { _id: req.params.id },
    {
      _id: 0,
      __v: 0,
      teacher_phone_number: 0,
      nic: 0,
      teacher_email: 0,
      teacher_password: 0,
      teacher_payday: 0,
      teacher_class: 0,
      tokens: 0,
      updated_date: 0,
    }
  )
    .then((teacher) => res.json(teacher))
    .catch((err) =>
      res.status(404).json({ noteacherfound: "Teacher not found" })
    );
});

// @route GET api/teacher/classlist/
// @description Get all books
// @access Public // .populate('publisher', 'companyName -_id')
router.get("/classlist/:id", authTeacher, (req, res) => {
  Teacher.findById(req.params.id)
    .select("teacher_class")
    .populate("teacher_class", "-post_list -student_list -updated_date -__v")
    .then((teacher) => res.json(teacher))
    .catch((err) =>
      res.status(404).json({ noteacherfound: "Teacher not found" })
    );
});

// @route GET api/teacher/classlist/
// @description Get all books
// @access Public
router.get("/classdetails/:id", authTeacher, (req, res) => {
  Class.find(
    { _id: req.params.id },
    {
      __v: 0,
      post_list: 0,
      student_list: 0,
      updated_date: 0,
    }
  )
    .then((classes) => res.json(classes))
    .catch((err) =>
      res.status(404).json({ noclassfound: "Teacher not found" })
    );
});

// @route GET api/books
// @description add/save book
// @access Public
router.post("/addclass", authTeacher, function (req, res) {
  Class.create(req.body)
    .then((classes) =>
      Teacher.updateOne(
        { _id: req.body.teacher_id },
        { $push: { teacher_class: classes._id } }
      )
    )
    .then(res.status(200).json({ msg: "Class added successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this class" })
    );
});

// @route GET api/books
// @description add/save book
// @access Public
router.post("/addstudent", authTeacher, function (req, res) {
  Promise.all([
    Student.updateOne(
      { student_uid: req.body.student_uid },
      { $push: { student_class: req.body.class_id } }
    ),
    Class.updateOne(
      { _id: req.body.class_id },
      { $push: { student_list: { student_uid: req.body.student_uid } } }
    ),
  ])
    .then(res.status(200).json({ msg: "Student added to class successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this student to class" })
    );
});

// @route GET api/books
// @description add/save book
// @access Public
router.post("/addpost", authTeacher, function (req, res) {
  Post.create(req.body)
  .then((posts) =>
    Class.updateOne(
      { _id: req.body.class_id },
      { $push: { post_list: posts._id } }
    )
  )
    .then(res.status(200).json({ msg: "Post added to class successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this post to class" })
    );
});

module.exports = router;
