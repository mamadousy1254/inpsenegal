"use client";

import { useState, useMemo } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  demoVideos,
  detectPlatform,
  getThumbnailUrl,
  getEmbedUrl,
  videoCategoryLabels,
  type Video,
  type VideoCategory,
} from "@/lib/demoVideos";

// Image fallback pour les vidéos sans thumbnail (Facebook)
const FACEBOOK_FALLBACK_THUMB =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%231877F2'/><stop offset='100%25' stop-color='%23145dbf'/></linearGradient></defs><rect width='1280' height='720' fill='url(%23g)'/><text x='50%25' y='50%25' font-family='system-ui,sans-serif' font-size='64' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'>Vidéo Facebook INP</text></svg>";

export default function VideosSection() {
  const [activeVideo, setActiveVideo] = useState<Video>(demoVideos[0]);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<VideoCategory | "all">("all");

  // Filtrer les vidéos selon la catégorie
  const filteredVideos = useMemo(() => {
    if (categoryFilter === "all") return demoVideos;
    return demoVideos.filter((v) => v.category === categoryFilter);
  }, [categoryFilter]);

  // Vidéos pour la playlist (toutes sauf celle en lecture)
  const playlistVideos = filteredVideos.filter((v) => v.id !== activeVideo.id);

  const handleVideoSelect = (video: Video) => {
    setActiveVideo(video);
    setIsPlayerLoaded(false); // reset le lazy load pour la nouvelle vidéo
  };

  const platform = detectPlatform(activeVideo.url);
  const thumbnail = getThumbnailUrl(activeVideo) || FACEBOOK_FALLBACK_THUMB;
  const embedUrl = getEmbedUrl(activeVideo);

  return (
    <section className="w-full bg-[#F8F1E0] py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête de section (format drapeau unifié = SectionTitle) */}
        <SectionTitle
          align="center"
          className="mb-10"
          subtitle="Retrouvez nos interventions, reportages et communications officielles."
        >
          INP en vidéo
        </SectionTitle>

        {/* Filtres de catégorie (pills) */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              categoryFilter === "all"
                ? "bg-[#7B4F2A] text-white"
                : "bg-white text-[#5A4733] hover:bg-[#E5DCC2]"
            }`}
          >
            Toutes
          </button>
          {(Object.keys(videoCategoryLabels) as VideoCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-[#7B4F2A] text-white"
                  : "bg-white text-[#5A4733] hover:bg-[#E5DCC2]"
              }`}
            >
              {videoCategoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Layout Featured + Playlist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLONNE GAUCHE — Player principal (2/3 sur desktop) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#E5DCC2]">
              {/* Player vidéo (lazy loaded) */}
              <div className="relative aspect-video bg-[#2A1F18]">
                {isPlayerLoaded && embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <button
                    onClick={() => setIsPlayerLoaded(true)}
                    className="group absolute inset-0 w-full h-full cursor-pointer"
                    aria-label={`Lire la vidéo : ${activeVideo.title}`}
                  >
                    {/* Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnail}
                      alt={activeVideo.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FACEBOOK_FALLBACK_THUMB;
                      }}
                    />

                    {/* Overlay sombre au hover */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                    {/* Badge plateforme */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {platform === "youtube" ? (
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          YouTube
                        </span>
                      ) : (
                        <span className="bg-[#1877F2] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </span>
                      )}
                    </div>

                    {/* Bouton play central */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 group-hover:bg-white/30 group-hover:scale-110 transition-all flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Durée en bas à droite */}
                    {activeVideo.duration && (
                      <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                        {activeVideo.duration}
                      </div>
                    )}
                  </button>
                )}
              </div>

              {/* Métadonnées de la vidéo */}
              <div className="p-5 md:p-6">
                <span className="inline-block text-xs font-semibold text-[#C9A574] tracking-wider uppercase mb-2">
                  {videoCategoryLabels[activeVideo.category]}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#2A1F18] leading-tight mb-3">
                  {activeVideo.title}
                </h3>
                {activeVideo.description && (
                  <p className="text-sm md:text-base text-[#5A4733] leading-relaxed mb-3">
                    {activeVideo.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5A4733]">
                  <span className="font-semibold">{activeVideo.source}</span>
                  <span className="text-[#C9A574]">•</span>
                  <span>
                    {new Date(activeVideo.publishedDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {activeVideo.duration && (
                    <>
                      <span className="text-[#C9A574]">•</span>
                      <span>{activeVideo.duration}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE — Playlist (1/3 sur desktop, scroll horizontal sur mobile) */}
          <div className="lg:col-span-1">
            <h4 className="hidden lg:block text-sm font-bold text-[#7B4F2A] tracking-wider uppercase mb-3 pb-2 border-b-2 border-[#C9A574]">
              À voir aussi
            </h4>

            {/* Playlist : grid verticale sur desktop, scroll horizontal sur mobile */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[600px] pb-3 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 snap-x snap-mandatory lg:snap-none">
              {playlistVideos.map((video) => (
                <PlaylistItem
                  key={video.id}
                  video={video}
                  onClick={() => handleVideoSelect(video)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────
// Sous-composant : item de playlist
// ──────────────────────────────────────────────────
function PlaylistItem({ video, onClick }: { video: Video; onClick: () => void }) {
  const platform = detectPlatform(video.url);
  const thumb = getThumbnailUrl(video) || FACEBOOK_FALLBACK_THUMB;

  return (
    <button
      onClick={onClick}
      className="group flex-shrink-0 w-[280px] lg:w-full bg-white rounded-lg overflow-hidden border border-[#E5DCC2] hover:border-[#C9A574] hover:shadow-md transition-all text-left snap-start"
    >
      <div className="flex lg:flex-row gap-3 p-2">
        {/* Miniature */}
        <div className="relative w-32 lg:w-28 aspect-video flex-shrink-0 bg-[#2A1F18] rounded overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FACEBOOK_FALLBACK_THUMB;
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          {/* Indicateur play au hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Durée */}
          {video.duration && (
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
              {video.duration}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0 py-1">
          <h5 className="text-sm font-bold text-[#2A1F18] leading-tight mb-1 line-clamp-2 group-hover:text-[#7B4F2A] transition-colors">
            {video.title}
          </h5>
          <div className="flex items-center gap-1.5 text-xs text-[#5A4733]">
            {platform === "youtube" ? (
              <span className="text-red-600 font-semibold">▶ YouTube</span>
            ) : (
              <span className="text-[#1877F2] font-semibold">▶ Facebook</span>
            )}
            <span className="text-[#C9A574]">•</span>
            <span className="truncate">{video.source}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
