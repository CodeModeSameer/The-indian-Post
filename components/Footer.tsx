import Link from "next/link";

const FOOTER_LINKS = [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container-main">
                <div className="footer-logo">The Indian Pulse</div>
                <p className="footer-tagline">Your Daily News Destination</p>
                <div className="footer-links">
                    {FOOTER_LINKS.map((link) => (
                        <Link key={link.label} href={link.href} className="footer-link">
                            {link.label}
                        </Link>
                    ))}
                </div>
                <p className="footer-copyright">
                    © {year} The Indian Pulse. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
