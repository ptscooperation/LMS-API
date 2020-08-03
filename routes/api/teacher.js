const express = require("express");
const router = express.Router();

// Load Teacher model
const Teacher = require("../../models/Teacher");
const Class = require("../../models/Class");
const auth = require("../../middleware/auth"); //auth

// @route GET api/teacher/test
// @description tests books route
// @access Public
router.get("/test", (req, res) => res.send("teacher route testing!"));

// @route GET api/teacher
// @description Get all books
// @access Public
router.get("/NI/:id", (req, res) => {
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
      res.status(404).json({ nobooksfound: "Teacher not found" })
    );
});

// @route GET api/books
// @description add/save book
// @access Public
router.post("/addclass", function (req, res) {
  Class.create(req.body).then((classes) =>
    Teacher.updateOne(
      { _id: req.body.teacher_id },
      { $push: { teacher_class: classes._id } }
    )
  );
  if (!req.body) {
    res.status(400).json({ error: "Unable to class this book" });
  } else {
    res.status(200).json({ msg: "Class added successfully" });
  }
});

module.exports = router;
