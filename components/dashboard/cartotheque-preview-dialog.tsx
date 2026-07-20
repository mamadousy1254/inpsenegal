"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CMS_STATUS_LABELS } from "@/lib/constants/cms";
import type { SerializedCartothequeItem } from "@/lib/services/cms/serialize-cartotheque";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

type CartothequePreviewDialogProps = {
  item: SerializedCartothequeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartothequePreviewDialog({
  item,
  open,
  onOpenChange,
}: CartothequePreviewDialogProps) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(
    null,
  );

  useEffect(() => {
    if (!open) {
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [open, item?._id]);

  const clampZoom = (value: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    setScale((prev) => clampZoom(prev + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)));
  }, []);

  const onPointerDown = (event: React.PointerEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  };

  const onPointerUp = (event: React.PointerEvent) => {
    dragRef.current = null;
    setIsDragging(false);
    try {
      (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[min(calc(100%-2rem),42rem)] max-w-[42rem] max-h-[min(92vh,720px)] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 space-y-1 border-b border-border px-5 py-4 pr-12">
          <DialogTitle className="text-base">{item.title}</DialogTitle>
          <DialogDescription>
            {CMS_STATUS_LABELS[item.status]}
            {item.publishedAt
              ? ` · Publié le ${new Date(item.publishedAt).toLocaleDateString("fr-FR")}`
              : null}
          </DialogDescription>
        </DialogHeader>

        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2">
          <p className="text-xs text-muted-foreground">
            Molette ou boutons pour zoomer · glisser la carte si zoom &gt; 100 %
          </p>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Zoom arrière"
              disabled={scale <= MIN_ZOOM}
              onClick={() => setScale((s) => clampZoom(s - ZOOM_STEP))}
            >
              <ZoomOutIcon className="size-4" />
            </Button>
            <span className="min-w-12 text-center text-xs font-medium tabular-nums">
              {Math.round(scale * 100)} %
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Zoom avant"
              disabled={scale >= MAX_ZOOM}
              onClick={() => setScale((s) => clampZoom(s + ZOOM_STEP))}
            >
              <ZoomInIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Réinitialiser le zoom"
              onClick={() => {
                setScale(1);
                setPan({ x: 0, y: 0 });
              }}
            >
              <RotateCcwIcon className="size-4" />
            </Button>
          </div>
        </div>

        <div
          ref={viewportRef}
          className={cn(
            "relative min-h-[220px] max-h-[min(50vh,360px)] flex-1 overflow-auto bg-[#1a1a1a]/5",
            scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default",
          )}
          onWheel={handleWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="img"
          aria-label={`Carte : ${item.title}`}
        >
          <div
            className="flex min-h-full min-w-full items-center justify-center p-4"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={1600}
              height={1200}
              className="h-auto max-h-[min(48vh,340px)] w-auto max-w-full select-none object-contain"
              draggable={false}
              priority
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Légende
          </p>
          <p className="mt-2 max-h-32 overflow-y-auto text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {item.legende}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
