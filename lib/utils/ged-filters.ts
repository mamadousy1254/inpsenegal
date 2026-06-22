import type { GedFileEntry, GedItemEntry } from "@/lib/services/ged/serialize-ged";

export const GED_FILTER_IDS = [
  "all",
  "folder",
  "file",
  "pdf",
  "image",
  "word",
  "excel",
  "text",
  "recent",
] as const;

export type GedFilterId = (typeof GED_FILTER_IDS)[number];

export function matchesGedFilter(
  item: GedItemEntry,
  filter: GedFilterId,
): boolean {
  if (filter === "all") return true;
  if (filter === "folder") return item.itemType === "folder";
  if (item.itemType === "folder") return filter === "folder";

  const file = item as GedFileEntry;
  const mime = file.mimeType.toLowerCase();
  const name = file.name.toLowerCase();

  switch (filter) {
    case "file":
      return true;
    case "pdf":
      return mime.includes("pdf") || name.endsWith(".pdf");
    case "image":
      return (
        mime.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/.test(name)
      );
    case "word":
      return (
        mime.includes("word") ||
        mime.includes("msword") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx")
      );
    case "excel":
      return (
        mime.includes("sheet") ||
        mime.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx")
      );
    case "text":
      return mime.includes("text/plain") || name.endsWith(".txt");
    case "recent": {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return new Date(file.createdAt).getTime() >= weekAgo;
    }
    default:
      return true;
  }
}
