import { useState } from "react";
import { createPlayer, updatePlayer } from "../services/playerService";

const PlayerForm = ({ player, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: player?.name || "",
    kills: player?.kills || 0,
    place: player?.place || 1,
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Kills:</label>
        <input
          type="number"
          name="kills"
          value={formData.kills}
          onChange={handleChange}
          min="0"
          required
        />
      </div>
      <div>
        <label>Place:</label>
        <input
          type="number"
          name="place"
          value={formData.place}
          onChange={handleChange}
          min="1"
          required
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default PlayerForm;
