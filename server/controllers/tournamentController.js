const Tournament = require("../models/Tournament");
const Player = require("../models/Player");

// Create new tournament
exports.createTournament = async (req, res) => {
  try {
    const { name, playerIds } = req.body;

    // Validate players exist
    const players = await Player.find({ _id: { $in: playerIds } });
    // Verify all players have same gameType
    const gameType = players[0]?.gameType;
    if (!players.every((p) => p.gameType === gameType)) {
      return res
        .status(400)
        .json({ error: "All players must be same game type" });
    }
    if (players.length !== playerIds.length) {
      return res.status(400).json({ error: "One or more players not found" });
    }

    const tournament = new Tournament({
      name,
      players: playerIds,
      status: "pending",
    });

    await tournament.save();
    res.status(201).json(tournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate bracket for tournament
exports.generateBracket = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    // Shuffle players randomly
    const shuffledPlayers = [...tournament.players].sort(
      () => 0.5 - Math.random()
    );

    // Create single elimination bracket
    const rounds = [];
    let currentRound = shuffledPlayers;

    while (currentRound.length > 1) {
      const matches = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        matches.push({
          player1: currentRound[i],
          player2: currentRound[i + 1] || null, // Handle odd number of players
          score1: 0,
          score2: 0,
          completed: false,
        });
      }

      rounds.push({
        matches,
        roundNumber: rounds.length + 1,
      });

      // Next round will have half as many players (winners)
      currentRound = new Array(Math.ceil(currentRound.length / 2));
    }

    tournament.rounds = rounds;
    tournament.status = "active";
    await tournament.save();

    res.json(tournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update match result
exports.updateMatchResult = async (req, res) => {
  try {
    const { tournamentId, roundIndex, matchIndex } = req.params;
    const { score1, score2 } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const match = tournament.rounds[roundIndex].matches[matchIndex];
    match.score1 = score1;
    match.score2 = score2;
    match.completed = true;
    match.winner = score1 > score2 ? match.player1 : match.player2;

    // Update player stats
    // Remove player stats updates since we simplified the Player model

    await tournament.save();
    res.json(tournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tournament details
exports.getTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate("players")
      .populate("rounds.matches.player1")
      .populate("rounds.matches.player2")
      .populate("rounds.matches.winner");

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    res.json(tournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
