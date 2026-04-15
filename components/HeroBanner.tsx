"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Banner } from "@/lib/supabase";

interface HeroBannerProps {
    banner: Banner | null;
}

// Placeholder banner for when no data exists
const PLACEHOLDER_BANNER: Banner = {
    id: "placeholder",
    image_url: "",
    heading:
        "Technology is moving faster than ever. AI is killing almost all the jobs.",
    lead_text:
        "Technology is advancing faster than ever, reshaping industries and redefining how we work. Innovations in artificial intelligence, led by companies like OpenAI and Google, are automating routine tasks. While some jobs disappear, new roles emerge, demanding creativity, adaptability, and digital skills for the future workforce.",
    created_at: new Date().toISOString(),
};

export default function HeroBanner({ banner }: HeroBannerProps) {
    const data = banner || PLACEHOLDER_BANNER;

    return (
        <motion.section
            className="hero-section container-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Hero Image */}
            {data.image_url ? (
                <div className="hero-image-wrapper">
                    <Image
                        src={data.image_url}
                        alt={data.heading}
                        fill
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        priority
                    />
                </div>
            ) : (
                <div
                    className="hero-image-wrapper"
                    style={{
                        background: "linear-gradient(135deg, #0a192f 0%, #1a365d 50%, #0d1117 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <span
                        style={{
                            color: "#ffffff",
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.5rem",
                            opacity: 0.7,
                        }}
                    >
                        The Indian Pulse
                    </span>
                </div>
            )}

            {/* Hero Content */}
            <div className="hero-content">
                <h2 className="hero-headline">{data.heading}</h2>
                <p className="hero-lead">{data.lead_text}</p>
            </div>
        </motion.section>
    );
}
