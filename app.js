const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = 5000;
const path = require("path");
const { dbKey } = require("./util/keys");
const mongoose = require("mongoose");
const multer = require("multer");
const uuidv4 = require("uuid/v4");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (["image/png", "image.jpg", "image/jpeg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"

app.use(bodyparser.json());
app.use(
  multer({
    storage: storage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message,
    data,
  });
});
// app.get("/", (req, res) => res.send({ title: "Hello World!" }));

mongoose
  .connect(dbKey, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(port, () =>
      console.log(`app listening on port ${port}!`)
    );
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("client connected");
    });

    console.log("database successfully connected");
  })
  .catch((err) => console.log(err));
