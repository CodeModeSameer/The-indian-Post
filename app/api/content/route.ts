import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

// Upload image to Supabase Storage and return public URL
async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
}

// GET /api/content?type=banner|news|video — List all content of a type
export async function GET(request: NextRequest) {
    try {
        const type = request.nextUrl.searchParams.get("type");

        if (type === "banner") {
            const { data, error } = await supabase
                .from("banners")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return NextResponse.json({ success: true, data: data || [] });
        }

        if (type === "news") {
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return NextResponse.json({ success: true, data: data || [] });
        }

        if (type === "video") {
            const { data, error } = await supabase
                .from("videos")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return NextResponse.json({ success: true, data: data || [] });
        }

        return NextResponse.json(
            { success: false, error: "Invalid content type" },
            { status: 400 }
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

// POST /api/content — Create new content (banner, news, or video)
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const type = formData.get("type") as string;
        const imageFile = formData.get("image") as File | null;

        let imageUrl = "";
        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadImage(imageFile);
        }

        if (type === "banner") {
            const heading = formData.get("heading") as string;
            const leadText = formData.get("leadText") as string;

            const { error } = await supabase.from("banners").insert({
                image_url: imageUrl,
                heading,
                lead_text: leadText,
            });

            if (error) throw error;
            revalidatePath("/");
            return NextResponse.json({ success: true, message: "Banner added!" });
        }

        if (type === "news") {
            const headline = formData.get("headline") as string;
            const body = formData.get("body") as string;
            const category = formData.get("category") as string;
            const link = formData.get("link") as string;

            const { error } = await supabase.from("news").insert({
                image_url: imageUrl,
                headline,
                body,
                category,
                link,
            });

            if (error) throw error;
            revalidatePath("/");
            return NextResponse.json({ success: true, message: "News added!" });
        }

        if (type === "video") {
            const title = formData.get("title") as string;
            const videoUrl = formData.get("videoUrl") as string;
            const category = formData.get("category") as string;

            const { error } = await supabase.from("videos").insert({
                thumbnail_url: imageUrl,
                video_url: videoUrl || "",
                title,
                category: category || "",
            });

            if (error) throw error;
            revalidatePath("/");
            return NextResponse.json({ success: true, message: "Video added!" });
        }

        return NextResponse.json(
            { success: false, error: "Invalid content type" },
            { status: 400 }
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

// PUT /api/content — Update existing content
export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const type = formData.get("type") as string;
        const id = formData.get("id") as string;
        const imageFile = formData.get("image") as File | null;

        let imageUrl: string | undefined;
        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadImage(imageFile);
        }

        if (type === "banner") {
            const heading = formData.get("heading") as string;
            const leadText = formData.get("leadText") as string;

            const updateData: Record<string, string> = { heading, lead_text: leadText };
            if (imageUrl) updateData.image_url = imageUrl;

            const { error } = await supabase
                .from("banners")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;
            revalidatePath("/");
            return NextResponse.json({ success: true, message: "Banner updated!" });
        }

        if (type === "news") {
            const headline = formData.get("headline") as string;
            const body = formData.get("body") as string;
            const category = formData.get("category") as string;
            const link = formData.get("link") as string;

            const updateData: Record<string, string> = { headline, body, category, link };
            if (imageUrl) updateData.image_url = imageUrl;

            const { error } = await supabase
                .from("news")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;
            revalidatePath("/");
            return NextResponse.json({ success: true, message: "News updated!" });
        }

        if (type === "video") {
            const title = formData.get("title") as string;
            const videoUrl = formData.get("videoUrl") as string;
            const category = formData.get("category") as string;

            const updateData: Record<string, string> = {
                title,
                video_url: videoUrl || "",
                category: category || "",
            };
            if (imageUrl) updateData.thumbnail_url = imageUrl;

            const { error } = await supabase
                .from("videos")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;
            revalidatePath("/");
            return NextResponse.json({ success: true, message: "Video updated!" });
        }

        return NextResponse.json(
            { success: false, error: "Invalid content type" },
            { status: 400 }
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

// DELETE /api/content — Delete content
export async function DELETE(request: NextRequest) {
    try {
        const { type, id } = await request.json();

        const table =
            type === "banner" ? "banners" :
            type === "news" ? "news" :
            type === "video" ? "videos" : null;

        if (!table) {
            return NextResponse.json(
                { success: false, error: "Invalid content type" },
                { status: 400 }
            );
        }

        const { error } = await supabase.from(table).delete().eq("id", id);

        if (error) throw error;
        revalidatePath("/");
        return NextResponse.json({ success: true, message: `${type} deleted!` });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
