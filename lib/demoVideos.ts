// TODO: REMPLACER PAR APPEL API BACK-OFFICE — données de démonstration.
// (URLs réelles reprises de l'ancienne section vidéos de l'INP.)

export type VideoPlatform = "youtube" | "facebook";

export type VideoCategory = "reportage" | "communication" | "conference" | "evenement";

export interface Video {
  id: string;
  url: string;                  // URL YouTube ou Facebook (détectée automatiquement)
  title: string;
  description?: string;
  category: VideoCategory;
  publishedDate: string;        // ISO ou format lisible
  duration?: string;            // "5:23", "1:42:15"
  source: string;               // "INP Sénégal", "7adakar", etc.
}

export const demoVideos: Video[] = [
  {
    id: "video-1",
    url: "https://www.youtube.com/watch?v=B0KbCYneVQg",
    title: "Présentation de l'Institut national de Pédologie",
    description:
      "Découvrez les missions et les expertises de l'INP au service de l'agriculture sénégalaise.",
    category: "communication",
    publishedDate: "2026-04-15",
    source: "INP Sénégal",
  },
  {
    id: "video-2",
    url: "https://www.youtube.com/watch?v=6Z1KPHXA97A",
    title: "La science des sols au service de l'agriculture durable",
    description:
      "Le Directeur Général de l'INP sur la durabilité des écosystèmes pédologiques sénégalais.",
    category: "conference",
    publishedDate: "2026-02-10",
    source: "INP Sénégal",
  },
  {
    id: "video-3",
    url: "https://web.facebook.com/reel/1185871166323084",
    title: "L'INP sur le terrain — Reportage officiel",
    description:
      "Reportage sur les interventions de terrain des équipes de l'Institut national de Pédologie.",
    category: "reportage",
    publishedDate: "2025-12-05",
    source: "INP Sénégal (Facebook)",
  },
  {
    id: "video-4",
    url: "https://web.facebook.com/reel/3993052014172220",
    title: "Activités et missions de l'INP — Rétrospective",
    description:
      "Retour en images sur les activités et événements marquants de l'Institut.",
    category: "evenement",
    publishedDate: "2025-11-18",
    source: "INP Sénégal (Facebook)",
  },
];

// ──────────────────────────────────────────────────
// Détection automatique de plateforme + extraction d'ID
// ──────────────────────────────────────────────────

export function detectPlatform(url: string): VideoPlatform | null {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/facebook\.com|fb\.watch/.test(url)) return "facebook";
  return null;
}

export function extractYouTubeId(url: string): string | null {
  // Supporte : youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Pour les vidéos YouTube, renvoie l'URL de la thumbnail haute résolution.
 * Pour Facebook, renvoie null (pas de thumbnail publique sans Graph API).
 */
export function getThumbnailUrl(video: Video): string | null {
  const platform = detectPlatform(video.url);
  if (platform === "youtube") {
    const id = extractYouTubeId(video.url);
    if (id) return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  }
  return null;
}

/**
 * Renvoie l'URL d'embed pour chaque plateforme.
 */
export function getEmbedUrl(video: Video): string | null {
  const platform = detectPlatform(video.url);

  if (platform === "youtube") {
    const id = extractYouTubeId(video.url);
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  if (platform === "facebook") {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      video.url
    )}&show_text=false&autoplay=1`;
  }

  return null;
}

export const videoCategoryLabels: Record<VideoCategory, string> = {
  reportage: "Reportages",
  communication: "Communications",
  conference: "Conférences",
  evenement: "Événements",
};
