import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  
  // Create Note Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Edit Note State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchNotes = async () => {
    try {
      const { data } = await api.get("/notes");
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const { data } = await api.post("/notes", { title, content });
      setNotes([data, ...notes]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await api.put(`/notes/${id}`, {
        title: editTitle,
        content: editContent,
      });
      setNotes(notes.map((note) => (note._id === id ? data : note)));
      cancelEdit();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleImageChange = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately using local object URL
    const previewUrl = URL.createObjectURL(file);
    setNotes(notes.map(note => note._id === id ? { ...note, previewImage: previewUrl } : note));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post(`/notes/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Replace with actual uploaded image URL logic
      setNotes(notes.map((note) => (note._id === id ? data : note)));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Filter notes client-side
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <button className="btn-logout" onClick={logout}>Log Out</button>
      </header>

      <div className="dashboard-content">
        <section className="create-section">
          <h2>Create Note</h2>
          <form onSubmit={handleCreate} className="create-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="4"
            />
            <button type="submit">Create Note</button>
          </form>
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Your Notes</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredNotes.length === 0 ? (
            <p>No notes found.</p>
          ) : (
            <div className="notes-list">
              {filteredNotes.map((note) => (
                <div key={note._id} className="note-card">
                  {editingId === note._id ? (
                    <div className="note-edit">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows="3"
                      />
                      <div className="edit-actions">
                        <button onClick={() => saveEdit(note._id)}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3>{note.title}</h3>
                      <p>{note.content}</p>
                      
                      {/* Image rendering */}
                      {(note.previewImage || note.image) && (
                        <div className="note-image-container">
                          <img 
                            src={note.previewImage || `http://localhost:5000/uploads/${note.image}`} 
                            alt="Note attachment" 
                            className="note-image"
                          />
                        </div>
                      )}

                      <div className="note-actions">
                        <label className="btn-upload">
                          Upload Image
                          <input 
                            type="file" 
                            accept="image/*" 
                            hidden 
                            onChange={(e) => handleImageChange(e, note._id)} 
                          />
                        </label>
                        <button onClick={() => startEdit(note)}>Edit</button>
                        <button onClick={() => handleDelete(note._id)} className="btn-delete">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
