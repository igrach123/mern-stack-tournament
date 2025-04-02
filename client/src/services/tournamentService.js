import axios from "axios";

const API_URL = "http://localhost:5000/api/tournaments";

export const createTournament = (name, playerIds) => {
  return axios.post(API_URL, { name, playerIds });
};

export const generateBracket = (tournamentId) => {
  return axios.post(`${API_URL}/${tournamentId}/generate-bracket`);
};

export const updateMatchResult = (
  tournamentId,
  roundIndex,
  matchIndex,
  score1,
  score2
) => {
  return axios.put(
    `${API_URL}/${tournamentId}/rounds/${roundIndex}/matches/${matchIndex}`,
    { score1, score2 }
  );
};

export const getTournament = (tournamentId) => {
  return axios.get(`${API_URL}/${tournamentId}`);
};
