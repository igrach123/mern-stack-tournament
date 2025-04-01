const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  kills: {
    type: Number,
    required: true,
    min: 0,
  },
  place: {
    type: Number,
    required: true,
    min: 1,
  },
  score: {
    type: Number,
    default: 0,
  },
});

// Calculate score before saving
playerSchema.pre("save", function (next) {
  this.score = this.kills * 30 + (100 - this.place);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
