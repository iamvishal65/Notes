// src/pages/NewNotesPage.jsx
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NewNotesPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [noteId, setNoteId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("sid"); // ensure this is the raw token string

  // Base URL from env
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // optional: axios instance (local use)
  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: false, // set true if your backend uses cookies
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // autosave debounced effect
  useEffect(() => {
    // don't save if both fields empty
    if (!title && !content) return;

    // debounce timer
    const timer = setTimeout(async () => {
      setStatus("Saving...");
      try {
        if (noteId) {
          // Update existing note
          await axiosInstance.put(`/api/content/${noteId}`, {
            header: title, // use the key your backend expects
            content,
          });
          if (mountedRef.current) setStatus("Saved ✅");
          console.log("updated");
        } else {
          // Create new note
          const res = await axiosInstance.post(`/api/content`, {
            header: title,
            content,
          });
          // set returned id (adjust according to your backend response shape)
          const createdId = res?.data?.content?._id || res?.data?._id;
          if (createdId) setNoteId(createdId);
          if (mountedRef.current) setStatus("Saved ✅");
          console.log("created new note, id:", createdId);
        }
      } catch (err) {
        console.error("Error saving note:", err);
        if (mountedRef.current) setStatus("Error ❌");
      }
    }, 1000);

    return () => clearTimeout(timer);
    // include all values used inside effect
  }, [title, content, noteId, API_URL, token]); // note: API_URL and token rarely change in runtime

  const goHome = () => {
    navigate("/home");
  };

  return (
    <div className="p-6 flex flex-col h-screen">
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
