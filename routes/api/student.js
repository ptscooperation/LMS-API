const express = require("express");
const router = express.Router();
const moment = require("moment");

// Load Teacher model
const Student = require("../../models/Student");
const Class = require("../../models/Class");
const authStudent = require("../../middleware/authStudent"); //auth

// @route GET api/teacher/classlist/
// @description Get all books
// @access Public // .populate('publisher', 'companyName -_id')
router.get("/classlist/:id", authStudent, (req, res) => {
  Student.findById(req.params.id)
    .select("student_class")
    .select("student_uid")
    .populate("student_class", "-post_list -student_list -updated_date -__v")
    .then((student) => res.json(student))
    .catch((err) =>
      res.status(404).json({ noteacherfound: "Class not found" })
    );
});

// @route GET api/teacher/classlist/
// @description Get all books
// @access Public //$gte $lte .format("YYYY-MM-DD");
router.post("/feed", authStudent, (req, res) => {
  var date30 = moment(new Date()).subtract(30, "days").format("YYYY-MM-DD");
  // console.log(
  //   "classID : ",
  //   req.body.class_id,
  //   " studentID : ",
  //   req.body.student_uid,
  //   " 30day : ",
  //   date30
  // );
  Class.find(
    { _id: req.body.class_id },
    {
      student_list: {
        $elemMatch: {
          student_uid: req.body.student_uid,
          student_payday: { $gte: date30 },
        },
      },
    }
  )
    //.select("post_list")
    //.populate("post_list")
    .then((feed) => res.json(feed))
    .catch((err) =>
      res.status(404).json({ arrears: "Student was not pay for this month" })
    );
});

module.exports = router;
