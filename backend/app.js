const express = require("express");
const mongoose = require("mongoose");

const app = express();

// MongoDB connection
mongoose.connect("mongodb://mongodb:27017/test")
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

app.get("/api", (req, res) => {
  // 🔥 CPU Stress Logic
  let count = 0;
  for (let i = 0; i < 5e7; i++) {
    count += i;
  }
	res.json({ message: "Backend working 🚀" });
});

app.listen(3000, () => console.log("Server running on 3000"));
