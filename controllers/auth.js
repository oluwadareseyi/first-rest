const User = require("../models/user");
const { validationResult } = require("express-validator");
const errorHandler = require("../util/error");

exports.signUp = (req, res, next) => {
  const { email, password, name } = req.body;
};
