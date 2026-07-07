"use client";

import { motion } from "framer-motion";
import { Play, ExternalLink, Video as VideoIcon } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { isDirectVideoFile } from "@/lib/services/cms/video-url";
import { cn } from "@/lib/utils";

type VideoPlatform = "youtube" | "facebook" | "vimeo" | "dailymotion" | "autre";

export type PublishedVideoItem = {
  title: string;
  embedUrl: string;
  watchUrl: string;
  platform: VideoPlatform | string;
};

const PLATFORM_BADGE: Record<VideoPlatform, { label: string; style: string; iconBg: string }> = {
  youtube: { label: "YouTube", style: "bg-red-50 text-red-700 border-red-200", iconBg: "bg-red-50" },
  facebook: { label: "Facebook", style: "bg-blue-50 text-blue-700 border-blue-200", iconBg: "bg-blue-50" },
  vimeo: { label: "Vimeo", style: "bg-sky-50 text-sky-700 border-sky-200", iconBg: "bg-sky-50" },
  dailymotion: { label: "Dailymotion", style: "bg-indigo-50 text-indigo-700 border-indigo-200", iconBg: "bg-indigo-50" },
  autre: { label: "Vidéo", style: "bg-slate-100 text-slate-700 border-slate-200", iconBg: "bg-slate-100" },
};

function normalizePlatform(value: string): VideoPlatform {
  if (value === "facebook" || value === "youtube" || value === "vimeo" || value === "dailymotion") {
    return value;
  }
  return "autre";
}

function PlatformIcon({ platform }: { platform: VideoPlatform }) {
  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-red-600" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
      </svg>
    );
  }
  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-blue-600" aria-hidden>
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.063 1.376.126V8.06c-.15-.016-.508-.024-.908-.024-1.29 0-1.79.49-1.79 1.76v1.54h3.283l-.563 3.667h-2.72v8.278C19.396 22.46 24 17.755 24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.628 3.874 10.35 9.101 11.691Z" />
      </svg>
    );
  }
  const color =
    platform === "vimeo"
      ? "text-sky-600"
      : platform === "dailymotion"
        ? "text-indigo-600"
        : "text-slate-600";
  return <VideoIcon className={`h-3.5 w-3.5 ${color}`} aria-hidden />;
}

function VideoCard({ video, index }: { video: PublishedVideoItem; index: number }) {
  const platform = normalizePlatform(video.platform);
  const badge = PLATFORM_BADGE[platform];
  const isFile = isDirectVideoFile(video.embedUrl);

  return (
    <motion.div
      className="group relative rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex h-[3px] w-full">
        <div className="flex-1 bg-[#00853F]" />
        <div className="flex-1 bg-[#FDEF42]" />
        <div className="flex-1 bg-[#E31B23]" />
      </div>

      <div className="relative aspect-video overflow-hidden bg-gray-950">
        {isFile ? (
          <video
            src={video.embedUrl}
            title={video.title}
            controls
            preload="metadata"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <iframe
            src={video.embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        )}
      </div>

      <div className="border-t border-border/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${badge.iconBg}`}>
            <PlatformIcon platform={platform} />
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${badge.style}`}
          >
            {badge.label}
          </span>
        </div>

        <h3 className="mt-3 text-[15px] font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-[var(--inp-vert)] transition-colors duration-200">
          {video.title}
        </h3>

        <a
          href={video.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--inp-vert)]/5 border border-[var(--inp-vert)]/15 px-4 py-2 text-[12px] font-semibold text-[var(--inp-vert)] transition-all duration-200 hover:bg-[var(--inp-vert)] hover:text-white hover:border-[var(--inp-vert)]"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Regarder la vidéo
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </div>
    </motion.div>
  );
}

type VideosSectionProps = {
  videos: PublishedVideoItem[];
  showTitle?: boolean;
  embedded?: boolean;
  className?: string;
};

export function VideosSection({
  videos,
  showTitle = true,
  embedded = false,
  className,
}: VideosSectionProps) {
  if (videos.length === 0) return null;

  const content = (
    <>
      {showTitle && (
        <SectionTitle
          id="inp-videos-title"
          align="center"
          label="Médias"
          subtitle="Interventions, reportages et communications officielles de l'INP."
        >
          INP en vidéo
        </SectionTitle>
      )}

      {!showTitle && embedded && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground sm:text-3xl">INP en vidéo</h3>
          <div className="mx-auto mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C]" />
          <p className="mt-3 text-[14px] text-muted-foreground max-w-lg mx-auto">
            Retrouvez nos interventions, reportages et communications officielles.
          </p>
        </div>
      )}

      <div className={`grid gap-6 sm:grid-cols-2 ${showTitle || embedded ? "mt-10" : ""}`}>
        {videos.map((video, i) => (
          <VideoCard key={video.watchUrl} video={video} index={i} />
        ))}
      </div>

      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <a
          href="https://web.facebook.com/gestiondessols/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors duration-200 hover:text-[var(--inp-vert)]"
        >
          Suivez l&apos;INP sur les réseaux sociaux
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </motion.div>
    </>
  );

  if (embedded) {
    return (
      <div className={cn("scroll-mt-24", className ?? "mt-20")} id="inp-videos">
        {content}
      </div>
    );
  }

  return (
    <section
      className={cn("scroll-mt-24", className ?? "py-16 px-4 sm:py-20 bg-muted/30")}
      aria-labelledby="inp-videos-title"
      id="inp-videos"
    >
      <div className="container mx-auto max-w-6xl">{content}</div>
    </section>
  );
}
