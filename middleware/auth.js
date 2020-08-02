const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const jwt_key = process.env.JWT_KEY;

const auth = async (req, res, next) => {
  //const token = req.header("Authorization").replace("Bearer ", ""); // for Spring Boot back-end
  const token = req.header("x-access-token"); // for Node.js Express back-end

  try {
    const data = jwt.verify(token, jwt_key);
    const user = await User.findOne({ _id: data._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

module.exports = auth;
