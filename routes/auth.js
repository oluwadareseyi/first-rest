const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const passport = require("../services/social");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email", "Please enter a valid email")
      .isEmail()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-Mail already exists");
        }
      })
      .normalizeEmail(),
    body("password", "Password must have a minimum of 5 characters")
      .trim()
      .isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signUp
);

router.post("/login", authController.login);

router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  authController.social
);

module.exports = router;
