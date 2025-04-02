import { useState } from "react";
import { useLocation } from "react-router-dom";
import { createPlayer, updatePlayer } from "../services/playerService";
import { Form, Button, Card } from "react-bootstrap";

const PlayerForm = ({ player, onSuccess }) => {
  const location = useLocation();
  const defaultGameType = location.pathname.includes("fortnite")
    ? "fortnite"
    : "ea_fc";

  const [formData, setFormData] = useState({
    name: player?.name || "",
    gameType: player?.gameType || defaultGameType,
    ...(player?.gameType === "fortnite"
      ? {
          kills: player?.kills || 0,
          place: player?.place || 1,
        }
      : {}),
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (player) {
        await updatePlayer(player._id, formData);
      } else {
        await createPlayer(formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving player:", err);
    }
  };

  return (
    <Card className="mb-4 border-secondary">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <i className="fas fa-user-edit me-2"></i>
          {player ? "Edit Player" : "Add New Player"}
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Player Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter player name"
              required
            />
          </Form.Group>

          {formData.gameType === "fortnite" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Kills</Form.Label>
                <Form.Control
                  type="number"
                  name="kills"
                  value={formData.kills || 0}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Placement</Form.Label>
                <Form.Control
                  type="number"
                  name="place"
                  value={formData.place || 1}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </Form.Group>
            </>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="game" type="submit" className="px-4">
              <i className="fas fa-save me-2"></i>
              Save Player
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PlayerForm;
