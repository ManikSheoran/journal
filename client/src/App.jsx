import { useState } from "react";
import "./App.css";

function App() {
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    mood: "neutral",
    streaks: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === "streaks" ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("content", formValues.content);
    formData.append("mood", formValues.mood);
    formData.append("streaks", formValues.streaks);

    fetch("http://localhost:3000/api/users/journal?q=08062025", {
      method: "PUT",
      body: JSON.stringify({
        title: formValues.title,
        content: formValues.content,
        mood: formValues.mood,
        streaks: formValues.streaks
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" 
    })
    .then(res => res.json())
    .then(data => {
      console.log("Response:", data);
    })
    .catch(err => {
      console.error("Error:", err);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formValues.title}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="content"
        placeholder="Content"
        value={formValues.content}
        onChange={handleChange}
        required
      />

      <fieldset>
        <legend>Mood:</legend>
        {["happy", "sad", "neutral", "angry", "anxious"].map((m) => (
          <label key={m}>
            <input
              type="radio"
              name="mood"
              value={m}
              checked={formValues.mood === m}
              onChange={handleChange}
            />
            {m}
          </label>
        ))}
      </fieldset>

      <input
        type="number"
        name="streaks"
        placeholder="Streaks"
        value={formValues.streaks}
        onChange={handleChange}
        min="0"
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
