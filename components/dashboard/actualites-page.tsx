"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Loader2Icon,
  NewspaperIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import { toast } from "sonner";

import { ActualiteFormDialog } from "@/components/dashboard/actualite-form-dialog";
import {
  CmsVideoFormDialog,
  type CmsVideoItem,
} from "@/components/dashboard/cms-video-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CMS_STATUS_LABELS,
  NEWS_CATEGORY_LABELS,
} from "@/lib/constants/cms";
import type { SerializedActualite } from "@/lib/services/cms/serialize-actualite";
import { cn } from "@/lib/utils";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActualitesPage() {
  const [tab, setTab] = useState("actualites");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [actualites, setActualites] = useState<SerializedActualite[]>([]);
  const [videos, setVideos] = useState<CmsVideoItem[]>([]);

  const [actualiteDialogOpen, setActualiteDialogOpen] = useState(false);
  const [editingActualite, setEditingActualite] = useState<SerializedActualite | null>(null);

  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CmsVideoItem | null>(null);

  const fetchActualites = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        statusFilter !== "all" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await fetch(`/api/cms/actualites${params}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setActualites(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les actualités");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        statusFilter !== "all" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await fetch(`/api/cms/videos${params}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setVideos(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les vidéos");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (tab === "actualites") {
      void fetchActualites();
    } else {
      void fetchVideos();
    }
  }, [tab, fetchActualites, fetchVideos]);

  const handleDeleteActualite = async (item: SerializedActualite) => {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return;

    try {
      const res = await fetch(`/api/cms/actualites/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Actualité supprimée");
      void fetchActualites();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleDeleteVideo = async (item: CmsVideoItem) => {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return;

    try {
      const res = await fetch(`/api/cms/videos/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Vidéo supprimée");
      void fetchVideos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <NewspaperIcon className="size-7 text-[var(--inp-vert)]" />
            Contenu — Actualités
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les articles du site public et les vidéos INP (YouTube, Facebook).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="publie">Publié</SelectItem>
              <SelectItem value="brouillon">Brouillon</SelectItem>
            </SelectContent>
          </Select>

          {tab === "actualites" ? (
            <Button
              onClick={() => {
                setEditingActualite(null);
                setActualiteDialogOpen(true);
              }}
            >
              <PlusIcon className="size-4" />
              Nouvelle actualité
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditingVideo(null);
                setVideoDialogOpen(true);
              }}
            >
              <PlusIcon className="size-4" />
              Nouvelle vidéo
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="actualites">Actualités</TabsTrigger>
          <TabsTrigger value="videos">Vidéos INP</TabsTrigger>
        </TabsList>

        <TabsContent value="actualites" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : actualites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Aucune actualité pour le moment.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {actualites.map((item) => (
                <Card key={item._id}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">
                          {NEWS_CATEGORY_LABELS[item.category]}
                        </Badge>
                        <Badge
                          className={cn(
                            item.status === "publie"
                              ? "bg-emerald-500/10 text-emerald-700"
                              : "bg-slate-500/10 text-slate-700",
                          )}
                        >
                          {CMS_STATUS_LABELS[item.status]}
                        </Badge>
                        {item.isFeatured && (
                          <Badge className="bg-amber-500/10 text-amber-700">À la une</Badge>
                        )}
                      </div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.publishedAt ?? item.createdAt)} · /actualites/
                        {item.slug}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingActualite(item);
                          setActualiteDialogOpen(true);
                        }}
                      >
                        <PencilIcon className="size-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleDeleteActualite(item)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : videos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Aucune vidéo pour le moment.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {videos.map((item) => (
                <Card key={item._id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <VideoIcon className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize">
                        {item.platform}
                      </Badge>
                      <Badge
                        className={cn(
                          item.status === "publie"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-slate-500/10 text-slate-700",
                        )}
                      >
                        {CMS_STATUS_LABELS[item.status]}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{item.watchUrl}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.publishedAt)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingVideo(item);
                          setVideoDialogOpen(true);
                        }}
                      >
                        <PencilIcon className="size-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleDeleteVideo(item)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ActualiteFormDialog
        open={actualiteDialogOpen}
        onOpenChange={setActualiteDialogOpen}
        item={editingActualite}
        onSaved={() => void fetchActualites()}
      />

      <CmsVideoFormDialog
        open={videoDialogOpen}
        onOpenChange={setVideoDialogOpen}
        item={editingVideo}
        onSaved={() => void fetchVideos()}
      />
    </div>
  );
}
