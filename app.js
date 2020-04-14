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
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyparser.json());
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});
// app.get("/", (req, res) => res.send({ title: "Hello World!" }));

mongoose
  .connect(dbKey, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => console.log(`app listening on port ${port}!`));
    console.log("database successfully connected");
  })
  .catch((err) => console.log(err));
