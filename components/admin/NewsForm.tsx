"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/lib/supabase";
import type { NewsItem } from "@/lib/supabase";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function NewsForm() {
    const [headline, setHeadline] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState<string>(CATEGORIES[0]);
    const [link, setLink] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // History & edit state
    const [history, setHistory] = useState<NewsItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await fetch("/api/content?type=news");
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
        setHeadline("");
        setBody("");
        setCategory(CATEGORIES[0]);
        setLink("");
        setImage(null);
        setImageName("");
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEdit = (item: NewsItem) => {
        setEditingId(item.id);
        setHeadline(item.headline);
        setBody(item.body);
        // Match category (stored lowercase) back to CATEGORIES
        const matchedCat = CATEGORIES.find(
            (c) => c.toLowerCase() === item.category.toLowerCase()
        );
        setCategory(matchedCat || CATEGORIES[0]);
        setLink(item.link || "");
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
                body: JSON.stringify({ type: "news", id }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess("News article deleted.");
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
            formData.append("type", "news");
            formData.append("headline", headline);
            formData.append("body", body);
            formData.append("category", category.toLowerCase());
            formData.append("link", link);
            if (image) formData.append("image", image);
            if (editingId) formData.append("id", editingId);

            const res = await fetch("/api/content", {
                method: editingId ? "PUT" : "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(editingId ? "News article updated!" : "News article added!");
                resetForm();
                fetchHistory();
            } else {
                setError(data.error || "Failed to save news article.");
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
                    {editingId ? "Edit News Article" : "Add News Article"}
                </h2>

                {success && <div className="form-success">{success}</div>}
                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Article Image</label>
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
                                <span>{editingId ? "Upload new image (optional)" : "Click to upload an image"}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="news-headline">Headline</label>
                        <input
                            id="news-headline"
                            type="text"
                            className="form-input"
                            placeholder="Enter news headline..."
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="news-body">Description</label>
                        <ReactQuill
                            theme="snow"
                            value={body}
                            onChange={setBody}
                            placeholder="Enter article description..."
                            className="form-textarea-quill"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="news-category">Category</label>
                        <select
                            id="news-category"
                            className="form-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as typeof category)}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="news-link">Link (optional)</label>
                        <input
                            id="news-link"
                            type="url"
                            className="form-input"
                            placeholder="https://example.com/full-article"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="submit" className="form-btn" disabled={loading}>
                            {loading ? "Saving..." : editingId ? "Update Article" : "Save News Article"}
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
                <h3 className="history-title">News History</h3>
                {historyLoading ? (
                    <p className="history-loading">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="history-empty">No news articles uploaded yet.</p>
                ) : (
                    <div className="history-list">
                        {history.map((item) => (
                            <div key={item.id} className="history-card">
                                {item.image_url && (
                                    <div className="history-card-image">
                                        <img src={item.image_url} alt={item.headline} />
                                    </div>
                                )}
                                <div className="history-card-body">
                                    <h4 className="history-card-title">{item.headline}</h4>
                                    <p className="history-card-meta">
                                        <span className="history-badge">{item.category}</span>
                                        {" · "}
                                        {new Date(item.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                    <p className="history-card-text">{item.body}</p>
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
