const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");
const user = require("./models/user");
const exercise = require("./models/exercise");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewurlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongodb connection error: ", err));

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  const username = req.body.username;

  try {
    const data = await user.create({ username: username });
    res.json({ username: username, _id: data._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const data = await user.find();
    res.json(data);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const userid = await user.findById(req.params._id);
    if (!userid) return res.status(404).json({ error: "User Not Found" });

    const date = req.body.date ? new Date(req.body.date) : new Date();

    const newExercise = await exercise.create({
      userId: userid._id,
      description: req.body.description,
      duration: parseInt(req.body.duration),
      date: date,
    });

    res.json({
      _id: userid._id,
      username: userid.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date.toDateString(), // FCC expects this format
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const userid = await user.findById(req.params._id);
    if (!userid) return res.status(404).json({ error: "User Not Found" });

    let { from, to, limit } = req.query;

    let filter = { userId: userid._id };
    let exercises = await exercise.find(filter).select("description duration date");

    if (from) {
      const fromDate = new Date(from);
      exercises = exercises.filter(e => new Date(e.date) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      exercises = exercises.filter(e => new Date(e.date) <= toDate);
    }
    if (limit) {
      exercises = exercises.slice(0, parseInt(limit));
    }

    res.json({
      _id: userid._id,
      username: userid.username,
      count: exercises.length,
      log: exercises.map(e => ({
        description: e.description,
        duration: e.duration,
        date: e.date.toDateString(),
      })),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
