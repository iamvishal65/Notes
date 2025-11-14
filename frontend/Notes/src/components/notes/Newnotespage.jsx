import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";

const NewNotesPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [noteId, setNoteId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("sid");
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!title && !content) return;
    const timer = setTimeout(async () => {
      setStatus("Saving...");
      try {
        if (noteId) {
          await axiosInstance.put(
            `/api/content/${noteId}`,
            {
              Header: title,
              content,
            },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
              },
            }
          );
          if (mountedRef.current) setStatus("Saved ✅");
          console.log("updated");
        } else {
          
          const res = await axiosInstance.post(
            `/api/content`,
            {
              Header: title,
              content,
            },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
              },
            }
          );

          const createdId = res?.data?.content?._id || res?.data?._id;
          if (createdId) setNoteId(createdId);
          if (!mountedRef.current) setStatus("Saved ✅");
          console.log("created new note, id:", createdId);
        }
      } catch (err) {
        console.error("Error saving note:", err);
        if (mountedRef.current) setStatus("Error ❌");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, noteId, token]);

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
