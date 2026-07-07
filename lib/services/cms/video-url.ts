import type { CmsVideoPlatform } from "@/lib/constants/cms";

export type ParsedVideoUrl = {
  platform: CmsVideoPlatform;
  watchUrl: string;
  embedUrl: string;
  /** true si l'URL pointe vers un fichier vidéo direct (mp4, webm...) */
  isFile?: boolean;
};

const VIDEO_FILE_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];

export function isDirectVideoFile(url: string): boolean {
  try {
    const { pathname } = new URL(url.trim());
    const lower = pathname.toLowerCase();
    return VIDEO_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
  } catch {
    return false;
  }
}

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
    if (
      !parsed.hostname.includes("facebook.com") &&
      !parsed.hostname.includes("fb.watch")
    ) {
      return null;
    }

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

function parseVimeoUrl(url: string): ParsedVideoUrl | null {
  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.includes("vimeo.com")) return null;

    // https://vimeo.com/123456789 ou https://player.vimeo.com/video/123456789
    const segments = parsed.pathname.split("/").filter(Boolean);
    const videoId = segments.find((seg) => /^\d+$/.test(seg));
    if (!videoId) return null;

    return {
      platform: "vimeo",
      watchUrl: `https://vimeo.com/${videoId}`,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
    };
  } catch {
    return null;
  }
}

function parseDailymotionUrl(url: string): ParsedVideoUrl | null {
  try {
    const parsed = new URL(url.trim());
    if (
      !parsed.hostname.includes("dailymotion.com") &&
      !parsed.hostname.includes("dai.ly")
    ) {
      return null;
    }

    let videoId: string | null = null;
    if (parsed.hostname.includes("dai.ly")) {
      videoId = parsed.pathname.replace(/^\//, "").split("/")[0] || null;
    } else if (parsed.pathname.startsWith("/video/")) {
      videoId = parsed.pathname.split("/")[2] ?? null;
    } else if (parsed.pathname.startsWith("/embed/video/")) {
      videoId = parsed.pathname.split("/")[3] ?? null;
    }

    if (videoId) {
      videoId = videoId.split("_")[0];
    }
    if (!videoId) return null;

    return {
      platform: "dailymotion",
      watchUrl: `https://www.dailymotion.com/video/${videoId}`,
      embedUrl: `https://www.dailymotion.com/embed/video/${videoId}`,
    };
  } catch {
    return null;
  }
}

function parseGenericUrl(url: string): ParsedVideoUrl | null {
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    const watchUrl = parsed.toString();
    return {
      platform: "autre",
      watchUrl,
      embedUrl: watchUrl,
      isFile: isDirectVideoFile(watchUrl),
    };
  } catch {
    return null;
  }
}

export function parseVideoUrl(input: string): ParsedVideoUrl | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  return (
    parseYoutubeUrl(trimmed) ??
    parseFacebookUrl(trimmed) ??
    parseVimeoUrl(trimmed) ??
    parseDailymotionUrl(trimmed) ??
    parseGenericUrl(trimmed)
  );
}
