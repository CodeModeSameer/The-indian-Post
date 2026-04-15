"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { NewsItem } from "@/lib/supabase";

interface NewsFeedProps {
    items: NewsItem[];
}

// Placeholder items for when no data exists
const PLACEHOLDER_ITEMS: NewsItem[] = [
    {
        id: "p1",
        image_url: "",
        headline: "Olivia made the headlines!",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ultricies nisl. Integer porta magna vitae ligula finibus, id vulputate ipsum imperdiet. Sed commodo purus justo, ac consectetur ipsum malesuada mattis. In auctor, elit et accumsan bibendum, velit justo vulputate nunc, eget porttitor massa sapien sit amet libero.",
        category: "Entertainment",
        link: "#",
        created_at: new Date().toISOString(),
    },
    {
        id: "p2",
        image_url: "",
        headline: "New line of work wear hits the streets",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ultricies nisl. Integer porta magna vitae ligula finibus, id vulputate ipsum imperdiet. Sed commodo purus justo, ac consectetur ipsum malesuada mattis. In auctor, elit et accumsan bibendum, velit justo vulputate nunc, eget porttitor massa sapien sit amet libero.",
        category: "Business",
        link: "#",
        created_at: new Date().toISOString(),
    },
    {
        id: "p3",
        image_url: "",
        headline: "The duo you need to look out for",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ultricies nisl. Integer porta magna vitae ligula finibus, id vulputate ipsum imperdiet. Sed commodo purus justo, ac consectetur ipsum malesuada mattis. In auctor, elit et accumsan bibendum, velit justo vulputate nunc, eget porttitor massa sapien sit amet libero.",
        category: "World",
        link: "#",
        created_at: new Date().toISOString(),
    },
];

const placeholderColors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
];

export default function NewsFeed({ items }: NewsFeedProps) {
    const data = items.length > 0 ? items : PLACEHOLDER_ITEMS;

    return (
        <section className="news-feed container-main">
            {data.map((item, index) => (
                <motion.article
                    key={item.id}
                    className={`news-item ${index % 2 !== 0 ? "reverse" : ""}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    {/* News Image */}
                    <div className="news-image-wrapper">
                        {item.image_url ? (
                            <Image
                                src={item.image_url}
                                alt={item.headline}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                loading="lazy"
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    background: placeholderColors[index % placeholderColors.length],
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ opacity: 0.5 }}
                                >
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* News Text */}
                    <div className="news-text">
                        <h3 className="news-headline">{item.headline}</h3>
                        <p className="news-body">{item.body}</p>
                        <a
                            href={item.link || "#"}
                            className="news-cta"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Link for the news
                        </a>
                    </div>
                </motion.article>
            ))}
        </section>
    );
}
