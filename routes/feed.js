const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/feed");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

router.get("/posts", isAuth, controller.getPosts);

router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  controller.createPost
);

router.get("/post/:postId", isAuth, controller.getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  controller.updatePost
);

router.delete("/post/:postId", isAuth, controller.deletePost);

router.get("/status", isAuth, controller.getStatus);

router.patch("/status", isAuth, controller.updateStatus);

module.exports = router;
