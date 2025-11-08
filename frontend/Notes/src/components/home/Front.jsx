// src/components/home/Front.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig"; // <-- adjust if needed

const Front = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("sid");

  // Logout
  async function handleLogout() {
    try {
      // include token if your logout route requires auth
      await axiosInstance.post(
        "/api/auth/user/logout",
        {},
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      localStorage.removeItem("sid");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // still clear and redirect if logout failed due to network
      localStorage.removeItem("sid");
      navigate("/login");
    }
  }

  function noteDetail(id) {
    navigate(`/notes/${id}`);
  }

  async function deletedSelect(id) {
    try {
      await axiosInstance.delete(`/api/content/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        // withCredentials: true, // enable only if your backend uses cookies/sessions
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.log("Error deleting note:", error);
    }
  }

  useEffect(() => {
    async function dataContent() {
      try {
        const response = await axiosInstance.get("/api/content", {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        
        });
        // backend might return { content: [...] } or directly [...]
        const content = response?.data?.content ?? response?.data ?? [];
        setNotes(Array.isArray(content) ? content : []);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    dataContent();
  }, [token]);

  function newNotes() {
    navigate(`/newnote`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">My Notes</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center">No notes yet. Create one!</p>
        ) : (
          <ul className="space-y-4">
            {notes.map((note) => {
              const title = note?.header ?? note?.Header ?? note?.title ?? "Untitled";
              return (
                <li
                  key={note._id}
                  className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 rounded-lg p-4 transition"
                >
                  <span
                    onClick={() => noteDetail(note._id)}
                    className="text-lg text-gray-800 font-medium cursor-pointer"
                  >
                    {title}
                  </span>
                  <button
                    onClick={() => deletedSelect(note._id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={newNotes}
        className="fixed bottom-8 right-8 bg-blue-600 text-white text-3xl font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
      >
        +
      </button>
    </div>
  );
};

export default Front;
