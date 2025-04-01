import { useState, useEffect } from "react";
import { getPlayers, deletePlayer } from "../services/playerService";
import PlayerForm from "./PlayerForm";

const HighScoreTable = () => {
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await getPlayers();
      setPlayers(response.data);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlayer(id);
      fetchPlayers();
    } catch (err) {
      console.error("Error deleting player:", err);
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
  };

  const handleFormSuccess = () => {
    setEditingPlayer(null);
    fetchPlayers();
  };

  return (
    <div>
      <h2>Fortnite Tournament Leaderboard</h2>

      {editingPlayer ? (
        <PlayerForm player={editingPlayer} onSuccess={handleFormSuccess} />
      ) : (
        <>
          <PlayerForm onSuccess={fetchPlayers} />

          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Kills</th>
                <th>Place</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player._id}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.kills}</td>
                  <td>{player.place}</td>
                  <td>{player.score}</td>
                  <td>
                    <button onClick={() => handleEdit(player)}>Edit</button>
                    <button onClick={() => handleDelete(player._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default HighScoreTable;
