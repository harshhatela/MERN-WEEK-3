const Note = require("../models/Note");

/**
 * @desc    Get all notes belonging to the logged-in user
 * @route   GET /api/notes
 * @access  Private (requires JWT)
 *
 * Filters notes by the authenticated user's id so that
 * each user only sees their own notes.
 */
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({
      createdAt: -1, // newest first
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Get notes error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get a single note by its id
 * @route   GET /api/notes/:id
 * @access  Private (requires JWT)
 *
 * Finds the note and verifies that it belongs to the requesting user.
 * Returns 404 if the note doesn't exist, or if it belongs to someone else.
 */
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the note belongs to the logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Get note error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Private (requires JWT)
 *
 * Requires both title and content in the request body.
 * Automatically associates the note with the logged-in user.
 */
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // --- Validation: check for missing fields ---
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Please provide both title and content" });
    }

    // --- Create the note, linking it to the logged-in user ---
    const note = await Note.create({
      title,
      content,
      user: req.user.id,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update an existing note
 * @route   PUT /api/notes/:id
 * @access  Private (requires JWT)
 *
 * Finds the note, verifies ownership, then updates the fields
 * that were provided in the request body (title, content, or both).
 */
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check ownership — only the note's creator can update it
    if (note.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the note with whatever fields were sent in the body
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true, runValidators: true } // return the updated doc & validate
    );

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Update note error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Private (requires JWT)
 *
 * Finds the note, verifies ownership, then removes it from the database.
 */
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check ownership — only the note's creator can delete it
    if (note.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }

    await note.deleteOne();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Upload an image for a note
 * @route   POST /api/notes/:id/image
 * @access  Private (requires JWT)
 */
const uploadNoteImage = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update note image
    if (req.file) {
      note.image = req.file.filename;
      await note.save();
    } else {
      return res.status(400).json({ message: "No image file provided" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Upload note image error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote, uploadNoteImage };
