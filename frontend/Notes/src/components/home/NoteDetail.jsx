// src/components/home/NoteDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import _ from "lodash";
import axiosInstance from "../../api/axiosConfig"; // adjust path if needed

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [status, setStatus] = useState("Idle");
  const [loading, setLoading] = useState(true);

  // Fetch note once
  useEffect(() => {
    let mounted = true;
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("sid");
        const res = await axiosInstance.get(`/api/content/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        // Normalize returned data: backend might return { content: {...} } or {...}
        const data = res?.data?.content ?? res?.data ?? null;
        if (!data) {
          if (mounted) {
            setNote(null);
            navigate("/home");
          }
          return;
        }
        // Normalize title field to `header`
        const normalized = {
          ...data,
          header: data.header ?? data.Header ?? data.title ?? "",
          content: data.content ?? data.body ?? "",
        };
        if (mounted) setNote(normalized);
      } catch (err) {
        console.error("Error fetching note:", err);
        navigate("/home");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNote();
    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  // Debounced autosave
  const autoSave = useCallback(
    _.debounce(async (updatedNote) => {
      try {
        const token = localStorage.getItem("sid");
        setStatus("Saving...");
        // Send only fields your backend expects
        await axiosInstance.put(
          `/api/content/${id}`,
          { header: updatedNote.header, content: updatedNote.content },
          { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
        );
        setStatus("Saved ✅");
        setTimeout(() => setStatus("Idle"), 1500);
      } catch (error) {
        console.error("Error auto-saving:", error);
        setStatus("Error ❌");
      }
    }, 1000),
    [id]
  );

  // Cancel debounce on unmount
  useEffect(() => {
    return () => {
      autoSave.cancel && autoSave.cancel();
    };
  }, [autoSave]);

  const handleChange = (field, value) => {
    if (!note) return;
    const updated = { ...note, [field]: value };
    setNote(updated);
    autoSave(updated);
  };

  if (loading) {
    return <div className="p-6 text-gray-600 text-lg">Loading note...</div>;
  }

  if (!note) {
    return <div className="p-6 text-red-500 text-lg">Note not found.</div>;
  }

  return (
    <div className="p-6">
      <input
        type="text"
        value={note.header || ""}
        onChange={(e) => handleChange("header", e.target.value)}
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
