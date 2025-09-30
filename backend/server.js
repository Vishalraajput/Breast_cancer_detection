const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://Adarsh:Adarsh2005@cluster0.zwufa3g.mongodb.net/CancerPrediction", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  dob: String,
  blood_group: String,
  email: { type: String, unique: true },
  password: String,
  profession: String,
  history: [
    {
      result: String,
      image_url: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);

// ---------------- Register ----------------
app.post("/register", async (req, res) => {
  const { name, dob, blood_group, email, password, profession } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPw = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    dob,
    blood_group,
    email,
    password: hashedPw,
    profession,
    history: [],
  });

  await newUser.save();
  res.json({ message: "User registered successfully" });
});

// ---------------- Login ----------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // (optional) generate token
  const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "1d" });

  res.json({ message: "Login successful", email: user.email, token });
});

// ---------------- Save Prediction ----------------
app.post("/save-prediction", async (req, res) => {
  const { email, result, image_url } = req.body;

  await User.updateOne(
    { email },
    { $push: { history: { result, image_url, date: new Date() } } }
  );

  res.json({ message: "Prediction saved" });
});

// ---------------- Dashboard ----------------
app.get("/dashboard/:email", async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email }, { password: 0 });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));