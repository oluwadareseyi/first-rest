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

exports.createPost = async (req, res, next) => {
  const { title, content } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Please enter the correct data",
      errors: errors.array(),
    });
  }

  const post = new Post({
    title,
    content,
    creator: { name: "Seyi" },
    imageUrl: "/images/Rick-Morty.jpg",
  });

  await post.save();
  res.status(201).json({
    message: "Successfully created",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: {
        name: "Seyi",
      },
      createdAt: new Date(),
    },
  });
};
