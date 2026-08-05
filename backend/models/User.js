const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema
 * - name:     user's display name (required)
 * - email:    unique email address used for login (required)
 * - password: hashed password — never stored as plain text (required)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

/**
 * Pre-save hook — hashes the password with bcrypt before saving
 * the document to the database. Only runs when the password field
 * has been modified (e.g., on registration), so it won't re-hash
 * an already-hashed password on normal profile updates.
 */
userSchema.pre("save", async function (next) {
  // Skip hashing if the password hasn't been changed
  if (!this.isModified("password")) return next();

  // Generate a salt and hash the plain-text password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * matchPassword — instance method that compares a plain-text password
 * against the hashed password stored in the database using bcrypt.compare.
 * Returns true if they match, false otherwise.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
