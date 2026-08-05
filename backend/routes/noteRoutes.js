const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  uploadNoteImage,
} = require("../controllers/noteController");

/**
 * Note Routes — ALL protected by the JWT middleware.
 *
 * The protect middleware runs before every handler below, ensuring
 * only authenticated users can access these endpoints.
 *
 * GET    /api/notes      — list all notes for the logged-in user
 * GET    /api/notes/:id  — get a single note by id
 * POST   /api/notes      — create a new note
 * PUT    /api/notes/:id  — update a note
 * DELETE /api/notes/:id  — delete a note
 */
router.use(protect); // Apply JWT auth to all routes in this file

router.route("/").get(getNotes).post(createNote);
router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);
router.post("/:id/image", upload.single("image"), uploadNoteImage);

module.exports = router;
