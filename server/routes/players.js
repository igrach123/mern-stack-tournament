const express = require("express");
const router = express.Router();
const {
  createPlayer,
  getAllPlayers,
  updatePlayer,
  deletePlayer,
} = require("../controllers/playerController");

// Player routes
router.post("/", createPlayer);
router.get("/", getAllPlayers);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);

module.exports = router;
