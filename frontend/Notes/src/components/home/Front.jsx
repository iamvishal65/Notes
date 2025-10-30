import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Front = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("sid");
  const API_URL = process.env.REACT_APP_API_URL;
  async function handleLogout() {
    try {
      await axios.post(`${API_URL}/api/auth/user/logout`);
      localStorage.removeItem("sid");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function noteDetail(id) {
    navigate(`/notes/${id}`)
  }

  async function deletedSelect(id) {
    try {
      await axios.delete(`${API_URL}/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.log("Error deleting note:", error);
    }
  }

  useEffect(() => {
    async function dataContent() {
      try {
        const response = await axios.get("http://localhost:5000/api/content", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setNotes(response.data.content);
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
            {notes.map((note) => (
              <li
                key={note._id}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 rounded-lg p-4 transition"
              >
                <span onClick={()=>noteDetail(note._id)} className="text-lg text-gray-800 font-medium">
                  {note.Header}
                </span>
                <button
                  onClick={() => deletedSelect(note._id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
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
