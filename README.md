# MERN Week 3 — Notes App (Full Stack)

A full-stack notes application built with the MERN stack (MongoDB, Express, React, Node.js). Users can register, log in, and manage personal notes with full CRUD operations, client-side search, and image attachments.

## Project Structure

```
MERN Week 3/
├── backend/    # Express REST API (Node.js, MongoDB, JWT auth, file uploads)
├── frontend/   # React SPA (Vite, React Router, Axios)
└── README.md   # This file
```

Each directory has its own README with detailed setup instructions:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## Quick Start

You need both the backend and frontend running at the same time.

### 1. Backend

```bash
cd backend
npm install
# Create a .env file from .env.example and fill in your MongoDB URI and JWT secret
cp .env.example .env
npm run dev
```

The API starts at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

## Week 3 Assignment Mapping

| Assignment Requirement                | Where It's Implemented                                                                 |
|---------------------------------------|----------------------------------------------------------------------------------------|
| **Full Stack To-Do Application**      | React frontend (`frontend/src/pages/DashboardPage.jsx`) connected to the Express API for CRUD and search |
| **Image Upload Feature**              | `POST /api/notes/:id/image` endpoint (`backend/controllers/noteController.js`, `backend/middleware/upload.js`) + frontend upload UI in `DashboardPage.jsx` |
| **Task Manager Mini Project**         | The complete Notes App itself — auth, CRUD, search, and image uploads working end-to-end |
