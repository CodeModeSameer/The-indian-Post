"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Sports", href: "/sports" },
    { label: "Entertainment", href: "/entertainment" },
    { label: "Science", href: "/science" },
    { label: "Business", href: "/business" },
    { label: "World", href: "/world" },
    { label: "Politics", href: "/politics" },
    { label: "Technology", href: "/technology" },
];

function getCurrentDate(): string {
    const now = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}
``
export default function Header() {
    const pathname = usePathname();

    return (
        <header className="container-main">
            {/* Top Bar */}
            <div className="header-top">
                <div className="header-meta">
                    Saurabh Dandriyal
                    <br />
                    {getCurrentDate().toUpperCase()}
                </div>
                <h1
                    className="header-logo"
                    style={{ fontFamily: '"Times New Roman MT", "Times New Roman", Times, serif' }}
                >
                    The Indian Pulse
                </h1>
                <div className="header-search" aria-label="Search">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="nav-bar hide-scrollbar" aria-label="Main navigation" style={{ borderBottom: 'none' }}>
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-link ${isActive ? "active" : ""}`}
                            style={isActive ? { background: '#1a1a1a', color: '#ffffff' } : {}}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#1a1a1a';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = '';
                                    e.currentTarget.style.color = '';
                                }
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Double Rule - thick line on top, thin line below */}
            <div
                style={{
                    borderTop: '4px solid #000000',
                    borderBottom: '1px solid #000000',
                    paddingTop: '3px',
                    marginBottom: '1rem',
                }}
            />
        </header>
    );
}
