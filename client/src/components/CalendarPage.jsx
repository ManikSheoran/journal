import { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../styles/CustomCalendar.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);

    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    const formattedDate = `${dd}${mm}${yyyy}`;
    navigate(`/journal?q=${formattedDate}`);
  };

  return (
    <div className="w-screen min-h-screen bg-[#FFE3BB] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[700px] min-h-[500px] bg-white rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-[#03A6A1] mb-8 text-center">
          📅 Choose a Day
        </h2>
        <Calendar
          onChange={handleDateChange}
          value={date}
          className="react-calendar w-full"
        />
      </div>
    </div>
  );
};

export default CalendarPage;
