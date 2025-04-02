import { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { getPlayers } from "../services/playerService";

const PlayerList = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await getPlayers();
        setPlayers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const filteredPlayers =
    filter === "all" ? players : players.filter((p) => p.gameType === filter);

  return (
    <div className="mt-4">
      <div className="d-flex mb-3">
        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: "200px" }}>
          <option value="all">All Players</option>
          <option value="fortnite">Fortnite</option>
          <option value="ea_fc">EA FC</option>
        </Form.Select>
      </div>

      {loading ? (
        <div>Loading players...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Game</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td className="text-capitalize">{player.gameType}</td>
                <td>
                  {onSelectPlayer && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onSelectPlayer(player)}>
                      Select
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PlayerList;
