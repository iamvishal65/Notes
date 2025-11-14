const contentModel = require("../models/content.model");

async function createContent(req, res) {
  try {
    console.log("here");
    
    const newNote = await contentModel.create({
      Header: req.body.Header,
      content: req.body.content,
      createdBy: req.user.id,
    });
    res.status(201).json({ message: "Note created", content: newNote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getContent(req, res) {
  try {
    const userId = req.user.id;
    const notes = await contentModel.find({ createdBy: userId }).sort({ createdAt: -1 });
    console.log("Fetched content:", notes);
    res.status(200).json({ message: "Notes fetched", content: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getSingleContent(req, res) {
  try {
    const note = await contentModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ content: note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function updateNotes(req, res) {
  try {
    const { Header, content } = req.body;
    const updatedNote = await contentModel.findByIdAndUpdate(
      req.params.id,
      { Header, content },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note updated", content: updatedNote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function deleteNote(req, res) {
  try {
    const note = await contentModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await contentModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted", id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { createContent, getContent, getSingleContent, updateNotes, deleteNote };
