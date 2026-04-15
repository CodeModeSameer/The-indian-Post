"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Video } from "@/lib/supabase";

interface TrendingVideosProps {
    videos: Video[];
}

// Placeholder videos
const PLACEHOLDER_VIDEOS: Video[] = Array.from({ length: 5 }, (_, i) => ({
    id: `pv${i}`,
    thumbnail_url: "",
    video_url: "",
    title: "Video Title",
    category: "",
    created_at: new Date().toISOString(),
}));

const thumbColors = [
    "linear-gradient(180deg, #e8d5b7 0%, #c9a96e 100%)",
    "linear-gradient(180deg, #f5c6c6 0%, #e07575 100%)",
    "linear-gradient(180deg, #b5d5c5 0%, #6ba58a 100%)",
    "linear-gradient(180deg, #d5c6e8 0%, #9b7ec2 100%)",
    "linear-gradient(180deg, #c6d5e8 0%, #7e9bc2 100%)",
];

export default function TrendingVideos({ videos }: TrendingVideosProps) {
    const data = videos.length > 0 ? videos : PLACEHOLDER_VIDEOS;

    return (
        <section className="trending-section container-main">
            <h2 className="trending-title">Trending Videos</h2>
            <div className="trending-grid hide-scrollbar">
                {data.map((video, index) => {
                    const card = (
                        <motion.div
                            key={video.id}
                            className="video-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                        >
                            <div className="video-thumbnail">
                                {video.thumbnail_url ? (
                                    <Image
                                        src={video.thumbnail_url}
                                        alt={video.title}
                                        fill
                                        sizes="180px"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            position: "absolute",
                                            background: thumbColors[index % thumbColors.length],
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "1rem",
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="36"
                                            height="36"
                                            viewBox="0 0 24 24"
                                            fill="white"
                                            stroke="none"
                                            style={{ opacity: 0.6 }}
                                        >
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </div>
                                )}
                                {/* Play icon overlay for videos with URLs */}
                                {video.video_url && video.thumbnail_url && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "rgba(0,0,0,0.25)",
                                            borderRadius: "1rem",
                                            transition: "background 0.2s",
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="white"
                                            stroke="none"
                                            style={{ opacity: 0.9, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                                        >
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <p className="video-title">{video.title}</p>
                        </motion.div>
                    );

                    // Wrap in a link if video_url exists
                    if (video.video_url) {
                        return (
                            <a
                                key={video.id}
                                href={video.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 0 }}
                            >
                                {card}
                            </a>
                        );
                    }

                    return card;
                })}
            </div>
        </section>
    );
}
