import "./App.css";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return localStorage.getItem("isLoggedIn") === "true";
};

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={isAuthenticated() ? <Homepage /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
