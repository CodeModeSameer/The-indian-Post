"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Banner } from "@/lib/supabase";

export default function BannerForm() {
    const [heading, setHeading] = useState("");
    const [leadText, setLeadText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // History & edit state
    const [history, setHistory] = useState<Banner[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await fetch("/api/content?type=banner");
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
        setHeading("");
        setLeadText("");
        setImage(null);
        setImageName("");
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEdit = (item: Banner) => {
        setEditingId(item.id);
        setHeading(item.heading);
        setLeadText(item.lead_text);
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
                body: JSON.stringify({ type: "banner", id }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess("Banner deleted.");
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
            formData.append("type", "banner");
            formData.append("heading", heading);
            formData.append("leadText", leadText);
            if (image) formData.append("image", image);
            if (editingId) formData.append("id", editingId);

            const res = await fetch("/api/content", {
                method: editingId ? "PUT" : "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(editingId ? "Banner updated!" : "Banner added!");
                resetForm();
                fetchHistory();
            } else {
                setError(data.error || "Failed to save banner.");
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
                    {editingId ? "Edit Banner" : "Add Banner"}
                </h2>

                {success && <div className="form-success">{success}</div>}
                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Banner Image</label>
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
                        <label className="form-label" htmlFor="banner-heading">Heading</label>
                        <input
                            id="banner-heading"
                            type="text"
                            className="form-input"
                            placeholder="Enter banner headline..."
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="banner-lead">Lead Text</label>
                        <textarea
                            id="banner-lead"
                            className="form-textarea"
                            placeholder="Enter lead paragraph..."
                            value={leadText}
                            onChange={(e) => setLeadText(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="submit" className="form-btn" disabled={loading}>
                            {loading ? "Saving..." : editingId ? "Update Banner" : "Save Banner"}
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
                <h3 className="history-title">Banner History</h3>
                {historyLoading ? (
                    <p className="history-loading">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="history-empty">No banners uploaded yet.</p>
                ) : (
                    <div className="history-list">
                        {history.map((item) => (
                            <div key={item.id} className="history-card">
                                {item.image_url && (
                                    <div className="history-card-image">
                                        <img src={item.image_url} alt={item.heading} />
                                    </div>
                                )}
                                <div className="history-card-body">
                                    <h4 className="history-card-title">{item.heading}</h4>
                                    <p className="history-card-meta">
                                        {new Date(item.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                    <p className="history-card-text">{item.lead_text}</p>
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
