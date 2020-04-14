const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content:
          "welcome the choice is either to repel the provision blind fault",
        imageUrl: "images/Rick-Morty.jpg",
        creator: {
          name: "Seyi",
        },
        createdAt: new Date(),
      },
    ],
  });
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
    res.status(201).json({
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
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Please enter the correct data");
      error.statusCode = 422;
      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl: "/images/Rick-Morty.jpg",
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
