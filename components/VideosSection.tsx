"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { isDirectVideoFile } from "@/lib/services/cms/video-url";
import { CMS_VIDEO_PLATFORM_LABELS, type CmsVideoPlatform } from "@/lib/constants/cms";

export type HomeVideoItem = {
  _id: string;
  title: string;
  platform: string;
  watchUrl: string;
  embedUrl: string;
  publishedAt?: string;
};

// Image fallback pour les vidéos sans thumbnail (Facebook, Vimeo, autre...)
const GENERIC_FALLBACK_THUMB =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%237B4F2A'/><stop offset='100%25' stop-color='%235A4733'/></linearGradient></defs><rect width='1280' height='720' fill='url(%23g)'/><text x='50%25' y='50%25' font-family='system-ui,sans-serif' font-size='56' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'>INP en vidéo</text></svg>";

function normalizePlatform(value: string): CmsVideoPlatform {
  if (
    value === "youtube" ||
    value === "facebook" ||
    value === "vimeo" ||
    value === "dailymotion"
  ) {
    return value;
  }
  return "autre";
}

function extractYouTubeId(url: string): string | null {
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

function getThumbnail(video: HomeVideoItem): string {
  if (normalizePlatform(video.platform) === "youtube") {
    const id = extractYouTubeId(video.watchUrl) ?? extractYouTubeId(video.embedUrl);
    if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }
  return GENERIC_FALLBACK_THUMB;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function VideosSection({ videos = [] }: { videos?: HomeVideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<HomeVideoItem | null>(
    videos[0] ?? null,
  );
  if (videos.length === 0 || !activeVideo) return null;

  const playlistVideos = videos.filter((v) => v._id !== activeVideo._id);

  const handleVideoSelect = (video: HomeVideoItem) => {
    setActiveVideo(video);
  };

  const platform = normalizePlatform(activeVideo.platform);
  const isFile = isDirectVideoFile(activeVideo.embedUrl);
  const publishedLabel = formatDate(activeVideo.publishedAt);

  return (
    <section className="w-full bg-[#F8F1E0] py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTitle
          align="center"
          className="mb-10"
          subtitle="Retrouvez nos interventions, reportages et communications officielles."
        >
          INP en vidéo
        </SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLONNE GAUCHE — Player principal (2/3 sur desktop) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#E5DCC2]">
              <div className="relative aspect-video bg-[#2A1F18]">
                {isFile ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    key={activeVideo._id}
                    src={activeVideo.embedUrl}
                    title={activeVideo.title}
                    controls
                    preload="metadata"
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <iframe
                    key={activeVideo._id}
                    src={activeVideo.embedUrl}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="p-5 md:p-6">
                <div className="mb-2">
                  <PlatformBadge platform={platform} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#2A1F18] leading-tight mb-3">
                  {activeVideo.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5A4733]">
                  <span className="font-semibold">INP Sénégal</span>
                  {publishedLabel && (
                    <>
                      <span className="text-[#C9A574]">•</span>
                      <span>{publishedLabel}</span>
                    </>
                  )}
                  <span className="text-[#C9A574]">•</span>
                  <a
                    href={activeVideo.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#7B4F2A] hover:underline"
                  >
                    Ouvrir la source
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE — Playlist */}
          <div className="lg:col-span-1">
            <h4 className="hidden lg:block text-sm font-bold text-[#7B4F2A] tracking-wider uppercase mb-3 pb-2 border-b-2 border-[#C9A574]">
              À voir aussi
            </h4>

            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[600px] pb-3 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 snap-x snap-mandatory lg:snap-none">
              {playlistVideos.map((video) => (
                <PlaylistItem
                  key={video._id}
                  video={video}
                  onClick={() => handleVideoSelect(video)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lien vers toutes les vidéos */}
        <div className="mt-10 text-center">
          <Link
            href="/actualites#inp-videos"
            className="inline-flex items-center gap-2 rounded-full bg-[#7B4F2A] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#5A4733] hover:scale-[1.02]"
          >
            Voir toutes les vidéos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────
// Sous-composant : badge plateforme
// ──────────────────────────────────────────────────
function PlatformBadge({ platform }: { platform: CmsVideoPlatform }) {
  if (platform === "youtube") {
    return (
      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        YouTube
      </span>
    );
  }
  if (platform === "facebook") {
    return (
      <span className="bg-[#1877F2] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </span>
    );
  }
  return (
    <span className="bg-[#7B4F2A] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm6 4v8l6-4-6-4z" />
      </svg>
      {CMS_VIDEO_PLATFORM_LABELS[platform]}
    </span>
  );
}

// ──────────────────────────────────────────────────
// Sous-composant : item de playlist
// ──────────────────────────────────────────────────
function PlaylistItem({
  video,
  onClick,
}: {
  video: HomeVideoItem;
  onClick: () => void;
}) {
  const platform = normalizePlatform(video.platform);
  const isFile = isDirectVideoFile(video.embedUrl);
  const hasImageThumb = platform === "youtube";
  const thumb = getThumbnail(video);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group flex-shrink-0 w-[280px] lg:w-full cursor-pointer bg-white rounded-lg overflow-hidden border border-[#E5DCC2] hover:border-[#C9A574] hover:shadow-md transition-all text-left snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A574]"
    >
      <div className="flex lg:flex-row gap-3 p-2">
        <div className="relative w-32 lg:w-28 aspect-video flex-shrink-0 bg-[#2A1F18] rounded overflow-hidden">
          {hasImageThumb ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = GENERIC_FALLBACK_THUMB;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          ) : isFile ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={video.embedUrl}
              muted
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <iframe
              src={video.embedUrl}
              title={video.title}
              loading="lazy"
              tabIndex={-1}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}
        </div>

        <div className="flex-1 min-w-0 py-1">
          <h5 className="text-sm font-bold text-[#2A1F18] leading-tight mb-1 line-clamp-2 group-hover:text-[#7B4F2A] transition-colors">
            {video.title}
          </h5>
          <div className="flex items-center gap-1.5 text-xs text-[#5A4733]">
            {platform === "youtube" ? (
              <span className="text-red-600 font-semibold">▶ YouTube</span>
            ) : platform === "facebook" ? (
              <span className="text-[#1877F2] font-semibold">▶ Facebook</span>
            ) : (
              <span className="text-[#7B4F2A] font-semibold">
                ▶ {CMS_VIDEO_PLATFORM_LABELS[platform]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
