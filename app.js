const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = 5000;
const { dbKey } = require("./config/keys");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

app.use(cors());

app.use(bodyparser.json());

// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/feed", feedRoutes);
// app.get("/", (req, res) => res.send({ title: "Hello World!" }));

mongoose.connect(dbKey)

app.listen(port, () => console.log(`app listening on port ${port}!`));
