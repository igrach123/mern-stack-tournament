require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const playerRoutes = require("./routes/players");
const tournamentRoutes = require("./routes/tournaments");

app.use("/api/players", playerRoutes);
app.use("/api/tournaments", tournamentRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Fortnite Tournament Manager API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
