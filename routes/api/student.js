const express = require("express");
const router = express.Router();

// Load Teacher model
const Student = require("../../models/Student");
const authStudent = require("../../middleware/authStudent"); //auth

// @route GET api/teacher/classlist/
// @description Get all books
// @access Public // .populate('publisher', 'companyName -_id')
router.get("/classlist/:id", authStudent, (req, res) => {
  Student.findById(req.params.id)
    .select("student_class")
    .populate("student_class", "-post_list -student_list -updated_date -__v")
    .then((student) => res.json(student))
    .catch((err) =>
      res.status(404).json({ noteacherfound: "Class not found" })
    );
});

module.exports = router;
