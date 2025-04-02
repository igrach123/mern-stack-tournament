import { useState, useEffect } from "react";
import { getPlayers, deletePlayer } from "../services/playerService";
import PlayerForm from "./PlayerForm";
import { Table, Button, Card } from "react-bootstrap";

const HighScoreTable = () => {
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await getPlayers({ gameType: "fortnite" });
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
    <Card className="bg-dark text-white border-secondary">
      <Card.Header className="bg-primary">
        <h2 className="text-center mb-0">
          <i className="fas fa-trophy me-2"></i>
          Fortnite Tournament Leaderboard
        </h2>
      </Card.Header>
      <Card.Body>
        {editingPlayer ? (
          <PlayerForm player={editingPlayer} onSuccess={handleFormSuccess} />
        ) : (
          <>
            <PlayerForm onSuccess={fetchPlayers} gameType="fortnite" />

            <Table striped bordered hover variant="dark" className="mt-4">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Kills</th>
                  <th>Place</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player._id} className={index < 3 ? "top-rank" : ""}>
                    <td>
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : index + 1}
                    </td>
                    <td className="fw-bold">{player.name}</td>
                    <td>{player.kills}</td>
                    <td>{player.place}</td>
                    <td
                      className={index < 3 ? "glow text-warning fw-bold" : ""}>
                      {player.score}
                    </td>
                    <td>
                      <Button
                        variant="outline-info"
                        onClick={() => handleEdit(player)}
                        className="me-2">
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(player._id)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default HighScoreTable;
