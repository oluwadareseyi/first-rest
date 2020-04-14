const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "Fetched Posts",
      posts,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const { title, content } = req.body;
  console.log(req.file);

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Please enter the correct data");
      error.statusCode = 422;
      throw error;
    }

    if (!req.file) {
      const error = new Error("Image not provided");
      error.statusCode = 422;
      throw error;
    }

    const imageUrl = req.file.path.replace("\\", "/");

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: { name: "Seyi" },
    });

    const result = await post.save();
    res.status(201).json({
      message: "Successfully created",
      post: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const { title, content } = req.body;
  let imageUrl = req.body.imageUrl;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
};
