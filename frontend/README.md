# Notes App Frontend

A React single-page application for managing personal notes. Includes user authentication (register/login), full CRUD for notes (create, read, update, delete), client-side search by title, and image attachments for notes.

Built with React 19, React Router, and Axios. Styled with vanilla CSS.

## Features

- **Register & Login** — JWT-based authentication with protected routes
- **Create, Edit, Delete Notes** — full CRUD from the dashboard
- **Search Notes** — filter notes by title in real time
- **Image Uploads** — attach an image to any note (instant preview, uploads to backend)
- **Responsive Layout** — works on desktop and mobile

## Prerequisites

The frontend expects the backend API to be running at `http://localhost:5000`. See the [backend README](../backend/README.md) for setup instructions.

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` by default (Vite).

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` directory.
