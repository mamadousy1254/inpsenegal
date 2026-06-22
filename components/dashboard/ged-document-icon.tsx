"use client";

import Image from "next/image";

import { resolveGedDocumentIcon } from "@/lib/utils/ged-icons";
import { cn } from "@/lib/utils";

export function GedDocumentIcon({
  itemType,
  mimeType,
  name,
  size = "md",
  className,
}: {
  itemType: "folder" | "file";
  mimeType?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const { src, alt } = resolveGedDocumentIcon({ itemType, mimeType, name });
  const dimensions =
    size === "xs"
      ? 16
      : size === "sm"
        ? 22
        : size === "lg"
          ? 34
          : 28;

  return (
    <Image
      src={src}
      alt={alt}
      width={dimensions}
      height={dimensions}
      className={cn("shrink-0 object-contain object-center", className)}
    />
  );
}
