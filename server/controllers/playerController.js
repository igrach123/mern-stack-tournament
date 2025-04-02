const Player = require("../models/Player");

// Create a new player
exports.createPlayer = async (req, res) => {
  try {
    const { gameType } = req.body;
    if (!gameType) {
      return res.status(400).json({ error: "gameType is required" });
    }
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all players sorted by score descending
exports.getAllPlayers = async (req, res) => {
  try {
    const { gameType } = req.query;
    const query = {};
    if (gameType) {
      query.gameType = gameType;
    }
    const players = await Player.find(query).sort({ score: -1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update player
exports.updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete player
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
