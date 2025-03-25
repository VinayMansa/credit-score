import "./App.css";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Profile from "./components/Profile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            // element={isAuthenticated() ? <Homepage /> : <Navigate to="/" />}
            element={<Homepage />}
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
