const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  score1: { type: Number, default: 0 },
  score2: { type: Number, default: 0 },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
  },
  completed: { type: Boolean, default: false },
});

const roundSchema = new mongoose.Schema({
  matches: [matchSchema],
  roundNumber: { type: Number, required: true },
});

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  rounds: [roundSchema],
  status: {
    type: String,
    enum: ["pending", "active", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tournament", tournamentSchema);
