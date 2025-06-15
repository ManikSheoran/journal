import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Journal from "./components/Journal.jsx"; 
import CalendarPage from "./components/CalendarPage.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      
        </Routes>
      </div>
    </Router>
  );
}

export default App;
