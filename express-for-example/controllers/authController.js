const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
  try {
    const { password, username } = req.body;

    const hashPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      password: hashPassword,
    });
    req.session.user = user;
    res.status(200).json({
      status: "sucess",
      data: {
        user,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { password, username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        status: "User not found!",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      return res.status(403).json({
        status: "Wrong password",
      });
    }

    req.session.user = user;

    return res.status(200).json({
      status: "sucess, you're logged",
      data: {
        user,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
    });
  }
};
