const express = require("express");
const router = express.Router();
const tournamentController = require("../controllers/tournamentController");

// Create new tournament
router.post("/", tournamentController.createTournament);

// Generate bracket for tournament
router.post("/:id/generate-bracket", tournamentController.generateBracket);

// Update match result
router.put(
  "/:tournamentId/rounds/:roundIndex/matches/:matchIndex",
  tournamentController.updateMatchResult
);

// Get tournament details
router.get("/:id", tournamentController.getTournament);

module.exports = router;
