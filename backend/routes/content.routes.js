const express = require("express");
const router = express.Router();
const contentController = require("../controller/content.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, contentController.createContent);
router.get("/", authMiddleware, contentController.getContent);
router.get("/:id", authMiddleware, contentController.getSingleContent);
router.put("/:id", authMiddleware, contentController.updateNotes);
router.delete("/:id", authMiddleware, contentController.deleteNote);

module.exports = router;
