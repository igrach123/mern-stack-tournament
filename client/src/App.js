import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import HighScoreTable from "./components/HighScoreTable";

function App() {
  return (
    <div className="App bg-dark text-light min-vh-100">
      <div className="container py-4">
        <HighScoreTable />
      </div>
    </div>
  );
}

export default App;
