import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewNotesPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("sid"); // saved on login

  const [noteId, setNoteId] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    if (!title && !content) return;
    const timer = setTimeout(async () => {
      try {
        if (noteId) {
          // Update existing note
          await axios.put(
            `${API_URL}/api/content/${id}`,
            { Header: title, content },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("updated");
        } else {
          // Create new note once
          const res = await axios.post(
           `${API_URL}/api/content/${id}`,
            { Header: title, content },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setNoteId(res.data.content._id);
          console.log("created new note");
        }
        setStatus("Saved ✅");
      } catch (err) {
        console.error("Error saving note:", err);
        setStatus("Error ❌");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content]);

  // Go back to home page
  const goHome = () => {
    navigate("/home");
  };

  return (
    <div className="p-6 flex flex-col h-screen">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={goHome}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to Home
        </button>
      </div>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <textarea
        placeholder="Content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-64 p-2 border"
      />
      <p className="mt-2 text-gray-500">{status}</p>
    </div>
  );
};

export default NewNotesPage;
