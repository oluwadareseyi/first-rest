const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", [body("")], authController.signUp);

module.exports = router;
