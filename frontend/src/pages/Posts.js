import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [activePost, setActivePost] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("sb-user"));
  const token = localStorage.getItem("sb-token");

  useEffect(() => {
    if (!user || !token) navigate("/login");
  }, [user, token, navigate]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/posts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!title || title.length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }
    if (!content || content.length < 20) {
      alert("Content must be at least 20 characters");
      return;
    }

    await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, tags })
    });

    setTitle(""); 
    setContent(""); 
    setTags("");
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await fetch(`http://localhost:5000/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPosts();
  };

  const handleUpdate = async (id, title, content, tags) => {
    await fetch(`http://localhost:5000/posts/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, tags })
    });
    fetchPosts();
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    localStorage.removeItem("sb-user");
    localStorage.removeItem("sb-token");
    navigate("/login");
  };

  const handleView = (post) => {
    setActivePost(post);
  };

  const closeModal = () => {
    setActivePost(null);
  };

 useEffect(() => { 
  fetchPosts(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  return (
    <>
      {}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <h1 className="nav-logo">mini-blog</h1>
          </div>
          <div className="nav-right">
            <span className="user-email">
              {user?.email?.split('@')[0] || "User"}
            </span>
            <button 
              className="nav-btn logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {}
      <div className="posts-container">
        <div className="posts-header">
          <div className="posts-title-section">
            <h2 className="posts-main-title">Your Blog Dashboard</h2>
            <div className="posts-stats">
              <span className="posts-count">
                <span className="count-number">{posts.length}</span> posts
              </span>
              <span className="posts-divider">•</span>
              <span className="posts-welcome">Welcome back, {user?.email?.split('@')[0] || "Writer"}!</span>
            </div>
          </div>
        </div>

        <div className="posts-content">
          {}
          <div className="create-post-section">
            <div className="create-post-header">
              <h3 className="create-post-title">
                <span className="create-icon">✍️</span> Create New Post
              </h3>
              <p className="create-post-subtitle">Share your thoughts with the world</p>
            </div>

            <div className="create-post-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input 
                  id="title"
                  placeholder="What's on your mind?" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="form-input"
                />
                <div className="char-count">
                  {title.length}/3 min characters
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="content">Content *</label>
                <textarea 
                  id="content"
                  placeholder="Write your story here..." 
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  className="form-textarea"
                  rows="6"
                />
                <div className="char-count">
                  {content.length}/20 min characters
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (optional)</label>
                <input 
                  id="tags"
                  placeholder="technology, lifestyle, travel (comma separated)" 
                  value={tags} 
                  onChange={e => setTags(e.target.value)}
                  className="form-input"
                />
                <div className="hint-text">
                  Add tags to help others find your post
                </div>
              </div>

              <button 
                onClick={handleCreate}
                className="create-post-btn"
                disabled={title.length < 3 || content.length < 20}
              >
                <span className="btn-icon">📝</span> Publish Post
              </button>
            </div>
          </div>

          {}
          <div className="posts-list-section">
            <div className="posts-list-header">
              <h3 className="posts-list-title">
                <span className="list-icon">📚</span> Your Posts ({posts.length})
              </h3>
              <div className="sort-options">
                <span className="sort-active">Latest First</span>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="empty-posts">
                <div className="empty-icon">📄</div>
                <h4>No posts yet</h4>
                <p>Create your first post to start your blogging journey!</p>
              </div>
            ) : (
              <div className="posts-grid">
                {posts.map(p => 
                  <PostCard
                    key={p.id}
                    post={p}
                    onDelete={handleDelete}
                    onView={() => handleView(p)}
                    onUpdate={handleUpdate}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      {activePost && (
        <div className="post-modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{activePost.title}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-meta">
                <span className="modal-date">
                  📅 {new Date(activePost.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {activePost.tags && (
                  <div className="modal-tags">
                    {activePost.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="tag-item">#{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-text">
                {activePost.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
