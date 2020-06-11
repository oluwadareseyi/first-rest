const User = require("../models/user");
const { validationResult } = require("express-validator");
const errorHandler = require("../util/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../util/keys");

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password, name } = req.body;
  console.log(email, password);

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
    res.status(201).json({ message: "Sign up successful", userId: data._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errorHandler("A user with this email could not be found", 401);
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      errorHandler("Please enter a correct password", 401);
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Successfully logged in", token, userId: user._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.social = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ googleId: req.user.id });
    let token;
    if (existingUser) {
      token = jwt.sign(
        { email: existingUser.email, userId: existingUser._id.toString() },
        jwtSecret,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ token });
    }

    const user = new User({
      googleId: req.user.id,
      name: req.user.displayName,
      email: req.user.emails[0].value,
    });

    const newUser = await user.save();
    token = jwt.sign(
      { email: newUser.email, userId: newUser._id.toString() },
      jwtSecret,
      { expiresIn: "24h" }
    );

    return res.status(201).json({ token });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
