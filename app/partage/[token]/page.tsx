"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  AlertCircleIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  Loader2Icon,
  ShieldCheckIcon,
} from "lucide-react";

import { GedDocumentIcon } from "@/components/dashboard/ged-document-icon";
import { formatBytes } from "@/components/dashboard/ged-views";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShareInfo = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  sharerName: string;
  expiresAt: string | null;
  durationLabel: string | null;
  recipientName: string | null;
};

type PageState =
  | { status: "loading" }
  | { status: "ready"; data: ShareInfo }
  | { status: "expired" }
  | { status: "error"; message: string };

function formatExpiryDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default function GedSharePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [state, setState] = useState<PageState>({ status: "loading" });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!token) {
      setState({ status: "error", message: "Lien de partage invalide." });
      return;
    }

    let cancelled = false;

    async function loadShare() {
      try {
        const response = await fetch(`/api/ged/shares/${encodeURIComponent(token)}`);
        const data = await response.json();

        if (cancelled) return;

        if (response.status === 410) {
          setState({ status: "expired" });
          return;
        }

        if (!response.ok) {
          setState({
            status: "error",
            message: data.error ?? "Ce lien de partage est introuvable.",
          });
          return;
        }

        setState({ status: "ready", data: data as ShareInfo });
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Impossible de charger ce partage pour le moment.",
          });
        }
      }
    }

    loadShare();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleDownload = async () => {
    if (!token || state.status !== "ready") return;

    setDownloading(true);
    try {
      const response = await fetch(
        `/api/ged/shares/${encodeURIComponent(token)}/download`,
      );
      const data = await response.json();

      if (response.status === 410) {
        setState({ status: "expired" });
        return;
      }

      if (!response.ok) {
        setState({
          status: "error",
          message: data.error ?? "Téléchargement impossible.",
        });
        return;
      }

      window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch {
      setState({
        status: "error",
        message: "Une erreur est survenue lors du téléchargement.",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F8F1E0]">
      <header className="border-b border-[#E5DCC2]/80 bg-white/80 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Image
            src="/icon.png"
            alt="INP"
            width={40}
            height={40}
            className="size-10 rounded-lg object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--inp-vert)]">
              Institut National de Pédagogie
            </p>
            <p className="text-xs text-muted-foreground">Partage sécurisé GED</p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {state.status === "loading" ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E5DCC2] bg-white p-10 shadow-sm">
              <Loader2Icon className="size-8 animate-spin text-[var(--inp-vert)]" />
              <p className="text-sm text-muted-foreground">
                Vérification du lien de partage…
              </p>
            </div>
          ) : null}

          {state.status === "expired" ? (
            <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <ClockIcon className="size-7" />
              </span>
              <h1 className="text-lg font-semibold text-foreground">
                Lien expiré
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Ce lien de partage n&apos;est plus valide. Demandez un nouveau
                lien à la personne qui vous a partagé ce document.
              </p>
            </div>
          ) : null}

          {state.status === "error" ? (
            <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-100 text-red-700">
                <AlertCircleIcon className="size-7" />
              </span>
              <h1 className="text-lg font-semibold text-foreground">
                Lien indisponible
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {state.message}
              </p>
            </div>
          ) : null}

          {state.status === "ready" ? (
            <div className="overflow-hidden rounded-2xl border border-[#E5DCC2] bg-white shadow-sm">
              <div className="border-b border-[#E5DCC2]/70 bg-gradient-to-br from-[var(--inp-vert)]/10 to-sky-500/5 px-6 py-5">
                <div className="flex items-start gap-2 text-[var(--inp-vert)]">
                  <ShieldCheckIcon className="mt-0.5 size-4 shrink-0" />
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium">{state.data.sharerName}</span>{" "}
                    vous a partagé un document.
                  </p>
                </div>
              </div>

              <div className="space-y-6 px-6 py-6">
                <div className="flex items-center gap-4 rounded-xl border border-[#E5DCC2]/70 bg-[#F8F1E0]/40 p-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E5DCC2]/80">
                    <GedDocumentIcon
                      itemType="file"
                      mimeType={state.data.mimeType}
                      name={state.data.fileName}
                      size="lg"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="truncate text-base font-semibold text-foreground">
                      {state.data.fileName}
                    </h1>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileTextIcon className="size-3.5" />
                      {formatBytes(state.data.fileSize)}
                    </p>
                  </div>
                </div>

                {state.data.expiresAt ? (
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
                    <ClockIcon className="mt-0.5 size-3.5 shrink-0" />
                    <p>
                      Ce lien expire le{" "}
                      <span className="font-medium">
                        {formatExpiryDate(state.data.expiresAt)}
                      </span>
                      .
                    </p>
                  </div>
                ) : null}

                <Button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className={cn(
                    "h-11 w-full gap-2 bg-[var(--inp-vert)] text-white hover:bg-[var(--inp-vert)]/90",
                  )}
                >
                  {downloading ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" />
                      Préparation du téléchargement…
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="size-4" />
                      Télécharger le document
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="px-4 py-4 text-center text-[11px] text-muted-foreground">
        Document partagé via la GED de l&apos;Institut National de Pédagogie.
      </footer>
    </div>
  );
}
