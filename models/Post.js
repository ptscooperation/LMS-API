const mongoose = require("mongoose");

const Post_Schema = new mongoose.Schema({
  // post_uid: {
  //   type: String,
  //   required: true,
  // },
  post_data: {
    type: String,
    required: true,
  },
    updated_date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Post = mongoose.model("post", ClassSchema);
