import { supabase } from "@/lib/supabase";
import type { Banner, NewsItem, Video } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import NewsFeed from "@/components/NewsFeed";
import TrendingVideos from "@/components/TrendingVideos";

// Force dynamic rendering so content changes (delete/update) show immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBanner(): Promise<Banner | null> {
  const { data } = await supabase
    .from("banners")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

async function getNews(): Promise<NewsItem[]> {
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getVideos(): Promise<Video[]> {
  const { data } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function HomePage() {
  let banner: Banner | null = null;
  let news: NewsItem[] = [];
  let videos: Video[] = [];

  try {
    [banner, news, videos] = await Promise.all([
      getBanner(),
      getNews(),
      getVideos(),
    ]);
  } catch {
    // Supabase not configured yet — will show placeholders
  }

  return (
    <>
      <Header />
      <main>
        <HeroBanner banner={banner} />
        <NewsFeed items={news} />
        <TrendingVideos videos={videos} />
      </main>
      <Footer />
    </>
  );
}
