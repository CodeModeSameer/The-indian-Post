"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BannerForm from "@/components/admin/BannerForm";
import NewsForm from "@/components/admin/NewsForm";
import VideoForm from "@/components/admin/VideoForm";

type ActiveForm = "banner" | "news" | "video" | null;

export default function AdminPage() {
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-title">Admin Panel</div>

                <button
                    className={`admin-sidebar-btn ${activeForm === "banner" ? "active" : ""}`}
                    onClick={() => setActiveForm("banner")}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                    </svg>
                    Add Banner
                </button>

                <button
                    className={`admin-sidebar-btn ${activeForm === "news" ? "active" : ""}`}
                    onClick={() => setActiveForm("news")}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    Add News
                </button>

                <button
                    className={`admin-sidebar-btn ${activeForm === "video" ? "active" : ""}`}
                    onClick={() => setActiveForm("video")}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
                    </svg>
                    Add Media
                </button>

                <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
                    <button
                        className="admin-sidebar-btn"
                        onClick={handleLogout}
                        style={{ borderColor: "#555", color: "#999" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                {!activeForm && (
                    <div className="empty-state" style={{ marginTop: "4rem" }}>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
                            Welcome to the Admin Panel
                        </h3>
                        <p>
                            Select an action from the sidebar to add a Banner, News article,
                            or Video to your website.
                        </p>
                    </div>
                )}

                {activeForm === "banner" && <BannerForm />}
                {activeForm === "news" && <NewsForm />}
                {activeForm === "video" && <VideoForm />}
            </main>
        </div>
    );
}
