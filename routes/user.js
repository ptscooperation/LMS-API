const express = require("express");

//const User = require("../models/User");
const Student = require("../models/Student");
const Tacher = require("../models/Teacher");
const authStudent = require("../middleware/authStudent");

const router = express.Router();

router.post("/signup/student", async (req, res) => {
  // /users ---> /
  // Create a new user
  try {
    const user = new Student(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/signup/teacher", async (req, res) => {
  // /users ---> /
  // Create a new user
  try {
    const user = new Tacher(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login/student", async (req, res) => {
  // /users/login/student ---> /login/student
  //Login a registered user
  try {
    const { email, password } = req.body;
    const user = await Student.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/login/teacher", async (req, res) => {
  // /users/login/teacher ---> /login/teacher
  //Login a registered user
  try {
    const { email, password } = req.body;
    const user = await Tacher.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/meStudent", authStudent, async (req, res) => {
  // /users/meStudent --> /meStudent
  // View logged in user profile
  res.send(req.user);
});

router.post("/meStudent/logout", authStudent);

async (req, res) => {
  // /users/meStudent/logout --> /meStudent/logout
  // Log user out of the application ???
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

router.post("/meStudent/logoutall", authStudent, async (req, res) => {
  // /users/meStudent/logoutall --> /meStudent/logoutall
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
