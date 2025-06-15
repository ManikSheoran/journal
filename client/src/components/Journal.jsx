import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Journal() {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("q");

  const [journal, setJournal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ content: "", mood: 3, todos: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) return;

    fetch(`http://localhost:3000/api/users/journal?q=${date}`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.journal) {
          setJournal(data.journal);
          setForm({
            content: data.journal.content,
            mood: data.journal.mood,
            todos: data.journal.todos || []
          });
        } else {
          setJournal(null); // No entry, but not an error
        }
      })
      .catch((err) => setError("Failed to fetch journal: " + err.message));
  }, [date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "mood" ? parseInt(value) : value
    }));
  };

  const handleSave = () => {
    fetch(`http://localhost:3000/api/users/journal?q=${date}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then((data) => {
        setJournal(data.journal);
        setIsEditing(false);
        setError(null);
      })
      .catch((err) => {
        alert("Failed to update journal: " + err.message);
      });
  };

  if (error) return <div>{error}</div>;
  if (!date) return <div>No date selected.</div>;

  return (
    <div>
      <h2>Journal Entry for {date}</h2>

      {!isEditing ? (
        journal ? (
          <div>
            <p><strong>Content:</strong> {journal.content}</p>
            <p><strong>Mood:</strong> {journal.mood}</p>
            <p><strong>Todos:</strong> {journal.todos.join(", ")}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        ) : (
          <div>
            <p>No journal entry found.</p>
            <button onClick={() => setIsEditing(true)}>Create Entry</button>
          </div>
        )
      ) : (
        <div>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your journal..."
            rows="5"
          />
          <br />
          <label>Mood (1–5): </label>
          <input
            type="number"
            name="mood"
            value={form.mood}
            onChange={handleChange}
            min="1"
            max="5"
          />
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Journal;
