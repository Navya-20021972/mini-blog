import { useState } from "react";
import "../styles/global.css";

export default function PostCard({ post, onDelete, onView, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editTags, setEditTags] = useState(post.tags || "");

  const handleSave = () => {
    if (!editTitle || editTitle.length < 3)
      return alert("Title must be at least 3 characters");
    if (!editContent || editContent.length < 20)
      return alert("Content must be at least 20 characters");

    onUpdate(post.id, editTitle, editContent, editTags);
    setIsEditing(false);
  };

  return (
    <div className="post-card">
      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
          />
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
          />
          <input
            placeholder="Tags"
            value={editTags}
            onChange={e => setEditTags(e.target.value)}
          />

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button
            className="cancel-btn"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h3 onClick={onView}>{post.title}</h3>

          <p>
            {post.content.slice(0, 120)}
            {post.content.length > 120 ? "..." : ""}
          </p>

          <p>
            <strong>Created:</strong>{" "}
            {new Date(post.created_at).toLocaleString()}
          </p>

          <p>
            <strong>Tags:</strong> {post.tags || "None"}
          </p>

          <button
            className="delete-btn"
            onClick={() => onDelete(post.id)}
          >
            Delete
          </button>

          <button
            className="edit-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}
