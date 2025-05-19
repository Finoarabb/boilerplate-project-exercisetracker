const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");
const user = require("./models/user");
const exercise = require("./models/exercise");
mongoose
  .connect(process.env.MONGO_URI,{
    useNewurlParser:true,
    useUnifiedTopology:true
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
  const _id = crypto.randomBytes(6).toString("hex");

  try {
    const data = await user.create({ username: username, _id: _id });
    res.json({ username: username, _id: _id });
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
  
  const userid = await user.findOne({ _id: req.body[':_id'] });
  if (!userid) {
    res.json({ error: "User Not Found" });
    return;
  }
  let data = {
    _id:req.body[':_id'],
    description:req.body.description,
    date: req.body.date ? new Date(req.body.date) : new Date(),
    username:userid.username
  };
  console.log('date='+req.body.date);
  console.log(data);
  try {
    const exercises = await exercise.create(data);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/users/:_id/logs',async (req,res) => {
  const userid = await user.findOne({ _id: req.params._id });
  let log = {};
  if (!userid) {
    res.json({ error: "User Not Found" });
    return;
  }
  log=userid;
  const exercises = await exercise.find({_id:log._id});
  log.count = exercises.length;
  log.log=exercises;
  res.json(log);
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
