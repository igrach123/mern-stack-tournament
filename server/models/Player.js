const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gameType: {
    type: String,
    enum: ["fortnite", "ea_fc"],
    required: true,
    immutable: true, // Prevent changing gameType after creation
  },
  // Fortnite specific fields
  kills: {
    type: Number,
    min: 0,
    required: function () {
      return this.gameType === "fortnite";
    },
  },
  place: {
    type: Number,
    min: 1,
    required: function () {
      return this.gameType === "fortnite";
    },
  },
  score: {
    type: Number,
  },
  // EA FC fields can be added here if needed
});

// Calculate score before saving
playerSchema.pre("save", function (next) {
  this.score = this.kills * 30 + (100 - this.place);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
