const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables from .env file into process.env
dotenv.config();

// Import route files
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

// Initialize Express app
const app = express();

// --- Middleware ---
// Parse incoming JSON request bodies (needed for POST/PUT endpoints)
app.use(express.json());

// Enable CORS
app.use(cors());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Mount Routes ---
// Auth routes: register and login (public)
app.use("/api/auth", authRoutes);

// Note routes: CRUD operations (protected by JWT middleware)
app.use("/api/notes", noteRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start listening for requests
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
