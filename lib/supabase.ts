import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase is properly configured
const isConfigured =
    supabaseUrl.startsWith("http") && supabaseAnonKey.length > 10;

// Create a real or mock client depending on configuration
function createSupabaseClient(): SupabaseClient {
    if (isConfigured) {
        return createClient(supabaseUrl, supabaseAnonKey);
    }
    // Return a dummy client that won't crash — all queries return empty
    return createClient(
        "https://placeholder.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTYxNjE2MTYsImV4cCI6MTkzMTczNzYxNn0.placeholder"
    );
}

export const supabase = createSupabaseClient();
export { isConfigured };

// Types for our database tables
export interface Banner {
    id: string;
    image_url: string;
    heading: string;
    lead_text: string;
    created_at: string;
}

export interface NewsItem {
    id: string;
    image_url: string;
    headline: string;
    body: string;
    category: string;
    link: string;
    created_at: string;
}

export interface Video {
    id: string;
    thumbnail_url: string;
    video_url: string;
    title: string;
    category: string;
    created_at: string;
}

export const CATEGORIES = [
    "Sports",
    "Entertainment",
    "Science",
    "Business",
    "World",
    "Politics",
    "Technology",
] as const;

export type Category = (typeof CATEGORIES)[number];
