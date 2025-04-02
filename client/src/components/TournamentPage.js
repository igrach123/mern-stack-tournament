import { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import {
  getTournament,
  generateBracket,
  updateMatchResult,
  createTournament,
} from "../services/tournamentService";
import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../services/playerService";
import PlayerForm from "./PlayerForm";

const TournamentPage = () => {
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playersRes = await getPlayers("ea_fc");
        setPlayers(playersRes.data);

        // Try to load existing tournament
        try {
          const tournamentRes = await getTournament("current-ea-fc-tournament");
          setTournament(tournamentRes.data);
        } catch {
          // No tournament exists yet
          setTournament(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateBracket = async () => {
    try {
      const response = await generateBracket(tournament._id);
      setTournament(response.data);
    } catch (err) {
      console.error("Error generating bracket:", err);
    }
  };

  const handleScoreUpdate = async (roundIndex, matchIndex, score1, score2) => {
    try {
      const response = await updateMatchResult(
        tournament._id,
        roundIndex,
        matchIndex,
        score1,
        score2
      );
      setTournament(response.data);
    } catch (err) {
      console.error("Error updating match:", err);
    }
  };

  const handleSavePlayer = async (playerData) => {
    try {
      let updatedPlayers;
      if (editingPlayer) {
        await updatePlayer(editingPlayer._id, playerData);
        updatedPlayers = players.map((p) =>
          p._id === editingPlayer._id ? { ...p, ...playerData } : p
        );
      } else {
        const response = await createPlayer(playerData);
        updatedPlayers = [...players, response.data];
      }
      setPlayers(updatedPlayers);
      setShowPlayerForm(false);
      setEditingPlayer(null);
    } catch (err) {
      console.error("Error saving player:", err);
    }
  };

  const handleDeletePlayer = async (id) => {
    try {
      await deletePlayer(id);
      setPlayers(players.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting player:", err);
    }
  };

  const handleCreateTournament = async () => {
    try {
      const response = await createTournament(
        "EA FC Tournament",
        players.map((p) => p._id)
      );
      setTournament(response.data);
    } catch (err) {
      console.error("Error creating tournament:", err);
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">Loading tournament data...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h3>EA FC Knockout Tournament</h3>
        </Card.Header>
        <Card.Body>
          {!tournament ? (
            <>
              <div className="mb-4">
                <h5>Players</h5>
                <ListGroup className="mb-3">
                  {players.map((player) => (
                    <ListGroup.Item
                      key={player._id}
                      className="d-flex justify-content-between align-items-center">
                      <div>{player.name}</div>
                      <div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setEditingPlayer(player);
                            setShowPlayerForm(true);
                          }}>
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeletePlayer(player._id)}>
                          Delete
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className="d-flex mb-3">
                  {!showPlayerForm ? (
                    <Button
                      variant="game"
                      onClick={() => setShowPlayerForm(true)}>
                      Add Player
                    </Button>
                  ) : (
                    <PlayerForm
                      player={editingPlayer}
                      onSuccess={handleSavePlayer}
                      onCancel={() => {
                        setShowPlayerForm(false);
                        setEditingPlayer(null);
                      }}
                    />
                  )}
                </div>

                {players.length > 0 && (
                  <Button
                    variant="game"
                    onClick={handleCreateTournament}
                    className="ms-2">
                    Create Tournament
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between mb-4">
                {tournament.status === "pending" &&
                  tournament.players.length > 1 && (
                    <Button variant="game" onClick={handleGenerateBracket}>
                      Generate Bracket
                    </Button>
                  )}
              </div>

              {tournament.rounds?.length > 0 && (
                <div className="bracket">
                  {tournament.rounds.map((round, roundIndex) => (
                    <div key={roundIndex} className="round">
                      <h4>Round {round.roundNumber}</h4>
                      {round.matches.map((match, matchIndex) => (
                        <Card key={matchIndex} className="mb-3">
                          <Card.Body>
                            <Row className="align-items-center">
                              <Col>{match.player1?.name || "TBD"}</Col>
                              <Col>
                                <input
                                  type="number"
                                  value={match.score1}
                                  onChange={(e) =>
                                    handleScoreUpdate(
                                      roundIndex,
                                      matchIndex,
                                      parseInt(e.target.value),
                                      match.score2
                                    )
                                  }
                                  className="form-control"
                                  disabled={match.completed}
                                />
                              </Col>
                              <Col className="text-center">vs</Col>
                              <Col>
                                <input
                                  type="number"
                                  value={match.score2}
                                  onChange={(e) =>
                                    handleScoreUpdate(
                                      roundIndex,
                                      matchIndex,
                                      match.score1,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="form-control"
                                  disabled={match.completed}
                                />
                              </Col>
                              <Col>{match.player2?.name || "TBD"}</Col>
                            </Row>
                            {match.completed && (
                              <div className="text-center mt-2">
                                Winner: {match.winner?.name || "TBD"}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TournamentPage;
