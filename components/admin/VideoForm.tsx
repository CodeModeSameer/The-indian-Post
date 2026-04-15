"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/lib/supabase";
import type { Video } from "@/lib/supabase";

export default function VideoForm() {
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [category, setCategory] = useState<string>(CATEGORIES[0]);
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // History & edit state
    const [history, setHistory] = useState<Video[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await fetch("/api/content?type=video");
            const data = await res.json();
            if (data.success) setHistory(data.data);
        } catch {
            // silently fail
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const resetForm = () => {
        setTitle("");
        setVideoUrl("");
        setCategory(CATEGORIES[0]);
        setImage(null);
        setImageName("");
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEdit = (item: Video) => {
        setEditingId(item.id);
        setTitle(item.title);
        setVideoUrl(item.video_url || "");
        const matchedCat = CATEGORIES.find(
            (c) => c.toLowerCase() === (item.category || "").toLowerCase()
        );
        setCategory(matchedCat || CATEGORIES[0]);
        setImage(null);
        setImageName("");
        setSuccess("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch("/api/content", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "video", id }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess("Video deleted.");
                setDeleteConfirm(null);
                fetchHistory();
            } else {
                setError(data.error || "Failed to delete.");
            }
        } catch {
            setError("Something went wrong.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const formData = new FormData();
            formData.append("type", "video");
            formData.append("title", title);
            formData.append("videoUrl", videoUrl);
            formData.append("category", category.toLowerCase());
            if (image) formData.append("image", image);
            if (editingId) formData.append("id", editingId);

            const res = await fetch("/api/content", {
                method: editingId ? "PUT" : "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(editingId ? "Video updated!" : "Video added!");
                resetForm();
                fetchHistory();
            } else {
                setError(data.error || "Failed to save video.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="admin-form-card">
                <h2 className="admin-form-title">
                    {editingId ? "Edit Media" : "Add Media"}
                </h2>

                {success && <div className="form-success">{success}</div>}
                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Video Thumbnail</label>
                        <div
                            className="form-file-input"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImage(file);
                                        setImageName(file.name);
                                    }
                                }}
                            />
                            {imageName ? (
                                <span style={{ color: "var(--color-text)" }}>📷 {imageName}</span>
                            ) : (
                                <span>{editingId ? "Upload new thumbnail (optional)" : "Click to upload a thumbnail"}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="video-title">Video Title</label>
                        <input
                            id="video-title"
                            type="text"
                            className="form-input"
                            placeholder="Enter video title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="video-url">Video URL (YouTube / Vimeo)</label>
                        <input
                            id="video-url"
                            type="url"
                            className="form-input"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="video-category">Category</label>
                        <select
                            id="video-category"
                            className="form-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as typeof category)}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="submit" className="form-btn" disabled={loading}>
                            {loading ? "Saving..." : editingId ? "Update Video" : "Save Video"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="form-btn form-btn-secondary"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* History */}
            <div className="history-section">
                <h3 className="history-title">Media History</h3>
                {historyLoading ? (
                    <p className="history-loading">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="history-empty">No videos uploaded yet.</p>
                ) : (
                    <div className="history-list">
                        {history.map((item) => (
                            <div key={item.id} className="history-card">
                                {item.thumbnail_url && (
                                    <div className="history-card-image">
                                        <img src={item.thumbnail_url} alt={item.title} />
                                    </div>
                                )}
                                <div className="history-card-body">
                                    <h4 className="history-card-title">{item.title}</h4>
                                    <p className="history-card-meta">
                                        {item.category && (
                                            <>
                                                <span className="history-badge">{item.category}</span>
                                                {" · "}
                                            </>
                                        )}
                                        {new Date(item.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                    {item.video_url && (
                                        <a
                                            href={item.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="history-card-link"
                                        >
                                            🔗 {item.video_url}
                                        </a>
                                    )}
                                </div>
                                <div className="history-card-actions">
                                    <button
                                        className="history-btn history-btn-edit"
                                        onClick={() => handleEdit(item)}
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                            <path d="m15 5 4 4" />
                                        </svg>
                                    </button>
                                    {deleteConfirm === item.id ? (
                                        <div className="history-delete-confirm">
                                            <button
                                                className="history-btn history-btn-danger"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                className="history-btn"
                                                onClick={() => setDeleteConfirm(null)}
                                            >
                                                No
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="history-btn history-btn-delete"
                                            onClick={() => setDeleteConfirm(item.id)}
                                            title="Delete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
