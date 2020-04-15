const User = require("../models/user");
const { validationResult } = require("express-validator");
const errorHandler = require("../util/error");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
  const errore = validationResult(req);
  const { email, password, name } = req.body;
  if (!errors.isEmpty()) {
    errorHandler("Invalid details entered", 422, errors.array());
  }
  try {
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
