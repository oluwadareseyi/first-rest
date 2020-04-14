const express = require("express");

const { body } = require("express-validator");

const controller = require("../controllers/feed");

const router = express.Router();

router.get("/posts", controller.getPosts);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  controller.createPost
);

router.get("/post/:postId", controller.getPost);

router.put("/post/:postId", controller.updatePost);

module.exports = router;
