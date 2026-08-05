# Notes App Backend

A RESTful API for a notes application with user authentication, built as a Week 2 MERN internship assignment. This single backend project covers all three assignment requirements — **To-Do List REST API**, **User Authentication API**, and the **Notes App Backend mini project** — by combining CRUD operations with JWT-based authentication into one clean API.

**Week 3** added CORS support (so the React frontend on a different port can call the API during development), image uploads for notes, and static file serving.

## Features

- **User Registration & Login** with hashed passwords (bcrypt) and JWT tokens
- **Full CRUD for Notes** — create, read, update, and delete
- **Private Notes** — each user can only access their own notes
- **Protected Routes** — all note endpoints require a valid JWT
- **Image Uploads** — attach an image to any note (5 MB limit, image mimetypes only)
- **Static File Serving** — uploaded images are served from `/uploads`
- **CORS Enabled** — allows cross-origin requests from the React frontend
- **Input Validation** with clear error messages and proper HTTP status codes
- **MongoDB** database with Mongoose ODM

## Technologies Used

| Technology    | Purpose                                |
|---------------|----------------------------------------|
| Node.js       | JavaScript runtime                     |
| Express.js    | Web framework for building the REST API|
| MongoDB       | NoSQL database for storing data        |
| Mongoose      | ODM for MongoDB (schemas & models)     |
| bcryptjs      | Password hashing                       |
| jsonwebtoken  | JWT creation and verification          |
| multer        | Multipart/form-data file uploads       |
| cors          | Cross-Origin Resource Sharing          |
| dotenv        | Environment variable management        |
| nodemon       | Auto-restart server during development |

## Folder Structure

```
notes-app-backend/
├── config/
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   ├── authController.js      # Register & login logic
│   └── noteController.js      # CRUD logic for notes + image upload
├── middleware/
│   ├── auth.js                # JWT verification middleware
│   └── upload.js              # Multer config (storage, 5 MB limit, image filter)
├── models/
│   ├── User.js                # User schema (name, email, hashed password)
│   └── Note.js                # Note schema (title, content, user ref, image)
├── routes/
│   ├── authRoutes.js          # POST /register, POST /login
│   └── noteRoutes.js          # GET, POST, PUT, DELETE /notes + POST /notes/:id/image
├── uploads/                   # Uploaded images (git-ignored except .gitkeep)
├── .env.example               # Sample environment variables
├── .gitignore                 # Ignores node_modules and .env
├── package.json               # Dependencies and scripts
├── server.js                  # App entry point
└── README.md                  # This file
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd notes-app-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Free MongoDB Atlas Cluster

Since this project uses MongoDB, you need a database. MongoDB Atlas offers a free tier:

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and click **"Try Free"**.
2. Sign up with your email or Google account.
3. When prompted, choose the **M0 Free** tier (Shared cluster).
4. Pick a cloud provider (any is fine) and a region close to you, then click **"Create Deployment"**.
5. **Create a database user**: enter a username and password — save these, you'll need them for the connection string. Click **"Create Database User"**.
6. **Set up network access**: click **"Add My Current IP Address"** so your machine can connect. For development, you can also add `0.0.0.0/0` to allow access from anywhere (not recommended for production).
7. Click **"Choose a connection method"** → **"Drivers"** → select **Node.js**.
8. Copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<username>` and `<password>` with the database user credentials you created in step 5. Also add your database name after the `/` (e.g., `notes-app`):
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/notes-app?retryWrites=true&w=majority
   ```

### 4. Set Up Environment Variables

Create a `.env` file in the project root (you can copy from the example):

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:

```env
PORT=5000
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/notes-app?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here_like_abc123xyz
```

### 5. Run the Server

**Development mode** (auto-restarts on file changes):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

You should see:
```
MongoDB connected: cluster0-shard-00-00.xxxxx.mongodb.net
Server running on port 5000
```

## API Endpoints

### Auth Routes (Public)

| Method | Endpoint              | Body                                        | Description                          |
|--------|-----------------------|---------------------------------------------|--------------------------------------|
| POST   | `/api/auth/register`  | `{ "name", "email", "password" }`           | Register a new user, returns JWT     |
| POST   | `/api/auth/login`     | `{ "email", "password" }`                   | Log in an existing user, returns JWT |

### Note Routes (Protected — requires Bearer token)

| Method | Endpoint                  | Body / Content-Type                                       | Description                                                  |
|--------|---------------------------|-----------------------------------------------------------|--------------------------------------------------------------|
| GET    | `/api/notes`              | —                                                         | Get all notes for the logged-in user                         |
| GET    | `/api/notes/:id`          | —                                                         | Get a single note by ID                                      |
| POST   | `/api/notes`              | `{ "title", "content" }`                                  | Create a new note                                            |
| PUT    | `/api/notes/:id`          | `{ "title", "content" }`                                  | Update an existing note                                      |
| DELETE | `/api/notes/:id`          | —                                                         | Delete a note                                                |
| POST   | `/api/notes/:id/image`    | `multipart/form-data` — field `image` (single image file) | Upload an image for a note (5 MB limit, image mimetypes only)|

Uploaded images are saved to the `uploads/` directory and served statically at `/uploads/<filename>` (e.g. `http://localhost:5000/uploads/1720000000000-photo.jpg`).

### Status Codes Used

| Code | Meaning                                      |
|------|----------------------------------------------|
| 200  | Success                                      |
| 201  | Created (new user or new note)               |
| 400  | Bad request (missing fields, duplicate email, wrong credentials, no image file) |
| 401  | Unauthorized (missing or invalid JWT)        |
| 404  | Not found (note doesn't exist or not yours)  |
| 500  | Server error                                 |

## How to Test with Postman

### Step 1: Register a User

- **Method**: POST
- **URL**: `http://localhost:5000/api/auth/register`
- **Body** (raw JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: You'll get back a JSON object containing `_id`, `name`, `email`, and `token`.

### Step 2: Copy the Token

From the registration (or login) response, copy the `token` value. This is your JWT.

### Step 3: Use the Token for Note Routes

For every note endpoint, add the token to the request headers:

- Go to the **Authorization** tab in Postman
- Select type **Bearer Token**
- Paste the token you copied

Or manually set the header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Step 4: Create a Note

- **Method**: POST
- **URL**: `http://localhost:5000/api/notes`
- **Headers**: `Authorization: Bearer <your-token>`
- **Body** (raw JSON):
  ```json
  {
    "title": "My First Note",
    "content": "This is the content of my first note."
  }
  ```

### Step 5: Upload an Image to a Note

- **Method**: POST
- **URL**: `http://localhost:5000/api/notes/<note-id>/image`
- **Headers**: `Authorization: Bearer <your-token>`
- **Body**: select **form-data**, add a field named `image` with type **File**, and choose an image file (max 5 MB).
- **Response**: The updated note object with the `image` field set to the saved filename.

### Step 6: Try All Other Endpoints

- **GET** `/api/notes` — see all your notes
- **GET** `/api/notes/:id` — get one note (use the `_id` from the create response)
- **PUT** `/api/notes/:id` — update the title or content
- **DELETE** `/api/notes/:id` — remove the note

## Deployment Notes

This is a **backend API** — it cannot be deployed to static hosting services like GitHub Pages, Netlify, or Vercel (static). Use a platform that supports Node.js servers:

- **[Render](https://render.com)** — create a new **Web Service**, connect your GitHub repo, set the build command to `npm install` and start command to `npm start`. Add your environment variables (`MONGO_URI`, `JWT_SECRET`) in the Render dashboard.
- **[Railway](https://railway.app)** — connect your GitHub repo, Railway auto-detects Node.js. Add environment variables in the project settings.

Remember to:
1. Set all three environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`) in the platform's dashboard.
2. Update your MongoDB Atlas network access to allow the deployment platform's IP (or use `0.0.0.0/0` for simplicity).

## Future Improvements

- **Note Categories / Tags** — allow users to organize notes with tags or categories and filter by them.
- **Password Reset** — add a "forgot password" flow using email with a time-limited reset token, so users can recover their accounts.
