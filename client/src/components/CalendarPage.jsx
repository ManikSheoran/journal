import { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);

    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    const formatted = `${dd}${mm}${yyyy}`;
    navigate(`/journal?q=${formatted}`);
  };

  return (
    <div>
      <h2>Select a Date</h2>
      <Calendar onChange={handleDateChange} value={date} />
    </div>
  );
}

export default CalendarPage;
