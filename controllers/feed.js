const Post = require("../models/post");
const { validationResult } = require("express-validator");
const errorHandler = require("../util/error");
const fs = require("fs");
const path = require("path");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  try {
    const count = await Post.find().countDocuments();
    totalItems = count;

    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "Fetched Posts",
      posts,
      totalItems,
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
      errorHandler("Could not find post", 404);
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

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorHandler("Please enter the correct data", 422);
    }

    if (!req.file) {
      errorHandler("Image not provided", 422);
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorHandler("Please enter the correct data", 422);
    }
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }

    if (!imageUrl) {
      errorHandler("no file picked", 422);
    }

    const post = await Post.findById(postId);

    if (!post) {
      errorHandler("no post found", 404);
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;

    const updatedPost = await post.save();
    res.status(200).json({
      message: "Post created succesfully",
      post: updatedPost,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      errorHandler("Post not found", 422);
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
