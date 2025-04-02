import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import HighScoreTable from "./components/HighScoreTable";
import TournamentPage from "./components/TournamentPage";
import { Navbar, Nav, Container } from "react-bootstrap";

function App() {
  return (
    <Router>
      <div className="App bg-dark text-light min-vh-100">
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Tournament App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/fortnite">
                  Fortnite
                </Nav.Link>
                <Nav.Link as={Link} to="/ea-fc">
                  EA FC
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="py-4">
          <Routes>
            <Route
              path="/fortnite"
              element={<HighScoreTable gameType="fortnite" />}
            />
            <Route
              path="/ea-fc"
              element={<TournamentPage gameType="ea_fc" />}
            />
            <Route path="/" element={<Navigate to="/fortnite" replace />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
