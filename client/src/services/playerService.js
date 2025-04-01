import axios from "axios";

const API_URL = "http://localhost:5000/api/players";

export const getPlayers = () => {
  return axios.get(API_URL);
};

export const createPlayer = (playerData) => {
  return axios.post(API_URL, playerData);
};

export const updatePlayer = (id, playerData) => {
  return axios.put(`${API_URL}/${id}`, playerData);
};

export const deletePlayer = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
