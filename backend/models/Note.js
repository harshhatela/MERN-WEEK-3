const mongoose = require("mongoose");

/**
 * Note Schema
 * - title:   the note's heading (required)
 * - content: the body text of the note (required)
 * - user:    a reference (ObjectId) to the User who owns this note,
 *            which keeps each user's notes private
 */
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Every note must belong to a user
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
