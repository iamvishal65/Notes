import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import _ from "lodash";

const NoteDetail = () => {
  const { id } = useParams(); // get note id from URL
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [status, setStatus] = useState("Idle"); // for showing save status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("sid");
        const res = await axios.get(`http://localhost:5000/api/content/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNote(res.data.content);
      } catch (error) {
        console.error("Error fetching note:", error);
        navigate("/home"); // redirect if note not found
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate]);

  const autoSave = useCallback(
    _.debounce(async (updatedNote) => {
      try {
        const token = localStorage.getItem("token");
        setStatus("Saving...");
        await axios.put(
          `http://localhost:5000/api/content/${id}`,
          updatedNote,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStatus("Saved ✅");
        setTimeout(() => setStatus("Idle"), 2000);
      } catch (error) {
        console.error("Error auto-saving:", error);
        setStatus("Error ❌");
      }
    }, 1000),
    [id]
  );

  const handleChange = (field, value) => {
    if (!note) return;
    const updatedNote = { ...note, [field]: value };
    setNote(updatedNote);
    autoSave(updatedNote);
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600 text-lg font-medium">
        Loading note...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="p-6 text-red-500 text-lg font-medium">
        Note not found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <input
        type="text"
        value={note.Header || ""}
        onChange={(e) => handleChange("Header", e.target.value)}
        className="w-full text-2xl font-bold mb-4 border-b p-2 outline-none"
        placeholder="Note title"
      />
      <textarea
        value={note.content || ""}
        onChange={(e) => handleChange("content", e.target.value)}
        className="w-full h-96 p-4 border rounded-lg outline-none"
        placeholder="Start writing..."
      />
      <p className="text-sm text-gray-500 mt-2">{status}</p>
    </div>
  );
};

export default NoteDetail;
