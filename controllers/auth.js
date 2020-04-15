const User = require("../models/user");
const { validationResult } = require("express-validator");
const errorHandler = require("../util/error");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
  const errore = validationResult(req);
  const { email, password, name } = req.body;
  try {
    if (!errors.isEmpty()) {
      errorHandler("Invalid details entered", 422, errors.array());
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      password: hashedPw,
      email,
      name,
    });
    const data = await user.save();
    data.password = null;
    res.status(210).json({ message: "Sign up successful", userId: data._id, data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
