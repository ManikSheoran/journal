import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Journal from "./components/Journal.jsx"; 
import CalendarPage from "./components/CalendarPage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
