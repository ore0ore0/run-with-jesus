// src/pages/RunMoments.jsx
import { useState, useEffect } from "react";

export default function RunMoments() {
  const [runMoments, setRunMoments] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all Run Moments on first render
  useEffect(() => {
    loadMoments();
  }, []);

  async function loadMoments() {
    try {
      const res = await fetch("/api/run-moments/list");
      const data = await res.json();
      if (data.ok) setRunMoments(data.moments);
    } catch (err) {
      console.error("Error loading moments:", err);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return alert("Please select a file first!");

    setLoading(true);
    try {
      // 1️⃣ Upload image to Vercel Blob
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/run-moments/blob-upload", {
        method: "POST",
        body: formData,
      });

      const { ok, url, error } = await uploadRes.json();
      if (!ok) {
        setLoading(false);
        return alert("Upload failed: " + error);
      }

      // 2️⃣ Save metadata to database
      const saveRes = await fetch("/api/run-moments/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, caption }),
      });

      const saveData = await saveRes.json();
      if (!saveData.ok) {
        setLoading(false);
        return alert("Save failed: " + saveData.error);
      }

      // 3️⃣ Add new image instantly to UI
      setRunMoments((prev) => [{ url, caption, id: Date.now() }, ...prev]);

      // Reset form
      setFile(null);
      setCaption("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(url) {
    if (!confirm("Are you sure you want to delete this Run Moment?")) return;
    try {
      const res = await fetch("/api/run-moments/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.ok) {
        // Remove image from UI instantly
        setRunMoments((prev) => prev.filter((m) => m.url !== url));
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
    }
  }

  return (
    <div className="run-moments" style={{ padding: "2rem" }}>
      <h2 style={{ color: "#CC5500", textAlign: "center" }}>
        Run Moments (우리의 순간)
      </h2>

      <form
        onSubmit={handleUpload}
        className="upload-form"
        style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ color: "#CC5500" }}
        />
        <input
          type="text"
          placeholder="Year and Name of Run Event (예: 2025 Belmont Water Dog Run)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{
            width: "60%",
            padding: "0.5rem",
            border: "1px solid #CC5500",
            borderRadius: "6px",
            color: "#CC5500",
            background: "white",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#E4A77D" : "#CC5500",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <div
        className="gallery"
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {runMoments.length === 0 && (
          <p style={{ textAlign: "center", color: "#555" }}>
            No Run Moments uploaded yet.
          </p>
        )}

        {runMoments.map((moment) => (
          <div
            key={moment.id || moment.url}
            className="moment"
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={moment.url}
              alt={moment.caption}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              className="moment-info"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0.75rem",
              }}
            >
              <p
                style={{
                  color: "#333",
                  fontSize: "0.9rem",
                  margin: 0,
                  wordBreak: "break-word",
                }}
              >
                {moment.caption}
              </p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(moment.url)}
                style={{
                  background: "transparent",
                  border: "1px solid #CC5500",
                  color: "#CC5500",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

