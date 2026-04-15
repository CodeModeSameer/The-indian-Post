import { supabase } from "@/lib/supabase";
import type { NewsItem } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsFeed from "@/components/NewsFeed";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 30;

// Generate static paths for all categories
export function generateStaticParams() {
    return CATEGORIES.map((cat) => ({
        category: cat.toLowerCase(),
    }));
}

// Dynamic SEO metadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category } = await params;
    const title = category.charAt(0).toUpperCase() + category.slice(1);
    return {
        title: `${title} — The Indian Pulse`,
        description: `Latest ${title} news from The Indian Pulse.`,
    };
}

async function getNewsByCategory(category: string): Promise<NewsItem[]> {
    const { data } = await supabase
        .from("news")
        .select("*")
        .ilike("category", category)
        .order("created_at", { ascending: false });
    return data || [];
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    const normalizedCategory = category.toLowerCase();

    // Validate category
    const validCategories = CATEGORIES.map((c) => c.toLowerCase());
    if (!validCategories.includes(normalizedCategory)) {
        notFound();
    }

    const displayName =
        normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1);

    let news: NewsItem[] = [];
    try {
        news = await getNewsByCategory(normalizedCategory);
    } catch {
        // Supabase not configured
    }

    return (
        <>
            <Header />
            <main className="container-main">
                <div className="category-header">
                    <h1 className="category-title">{displayName}</h1>
                </div>
                {news.length > 0 ? (
                    <NewsFeed items={news} />
                ) : (
                    <div className="empty-state">
                        <h3>No {displayName} stories yet</h3>
                        <p>Check back soon for the latest updates.</p>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
