-- ============================================================
-- The Indian Pulse — Supabase Database Setup
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Banners Table
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL DEFAULT '',
  heading TEXT NOT NULL,
  lead_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. News Table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thumbnail_url TEXT NOT NULL DEFAULT '',
  video_url TEXT DEFAULT '',
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (public read, authenticated write)
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public can read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public can read videos" ON videos FOR SELECT USING (true);

-- Allow inserts (from server-side API route using anon key)
CREATE POLICY "Allow inserts to banners" ON banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow inserts to news" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow inserts to videos" ON videos FOR INSERT WITH CHECK (true);

-- Allow updates
CREATE POLICY "Allow updates to banners" ON banners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow updates to news" ON news FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow updates to videos" ON videos FOR UPDATE USING (true) WITH CHECK (true);

-- Allow deletes
CREATE POLICY "Allow deletes from banners" ON banners FOR DELETE USING (true);
CREATE POLICY "Allow deletes from news" ON news FOR DELETE USING (true);
CREATE POLICY "Allow deletes from videos" ON videos FOR DELETE USING (true);

-- 5. Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to media bucket
CREATE POLICY "Public can read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Allow uploads to media bucket
CREATE POLICY "Allow uploads to media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
