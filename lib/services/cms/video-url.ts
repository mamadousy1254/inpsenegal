import type { CmsVideoPlatform } from "@/lib/constants/cms";

export type ParsedVideoUrl = {
  platform: CmsVideoPlatform;
  watchUrl: string;
  embedUrl: string;
};

function parseYoutubeUrl(url: string): ParsedVideoUrl | null {
  try {
    const parsed = new URL(url.trim());
    let videoId: string | null = null;

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace(/^\//, "").split("/")[0] || null;
    } else if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/")[2] ?? null;
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/")[2] ?? null;
      } else {
        videoId = parsed.searchParams.get("v");
      }
    }

    if (!videoId) return null;

    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    return {
      platform: "youtube",
      watchUrl,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    };
  } catch {
    return null;
  }
}

function parseFacebookUrl(url: string): ParsedVideoUrl | null {
  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.includes("facebook.com")) return null;

    const watchUrl = parsed.toString();
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(watchUrl)}&show_text=false&width=560`;

    return {
      platform: "facebook",
      watchUrl,
      embedUrl,
    };
  } catch {
    return null;
  }
}

export function parseVideoUrl(input: string): ParsedVideoUrl | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  return parseYoutubeUrl(trimmed) ?? parseFacebookUrl(trimmed);
}
