const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Post must have username."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Post must have password."],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
