const GED_ICONS = {
  folder: "/documents/folder.png",
  pdf: "/documents/pdf.png",
  image: "/documents/image.png",
  word: "/documents/word.png",
  excel: "/documents/excel.png",
  csv: "/documents/csv.png",
  text: "/documents/text.png",
  file: "/documents/file.svg",
} as const;

export type GedDocumentIconType = keyof typeof GED_ICONS;

export function resolveGedDocumentIcon(input: {
  itemType: "folder" | "file";
  mimeType?: string;
  name?: string;
}): { src: string; alt: string } {
  if (input.itemType === "folder") {
    return { src: GED_ICONS.folder, alt: "Dossier" };
  }

  const mime = (input.mimeType ?? "").toLowerCase();
  const name = (input.name ?? "").toLowerCase();

  if (mime.includes("pdf") || name.endsWith(".pdf")) {
    return { src: GED_ICONS.pdf, alt: "PDF" };
  }
  if (mime.includes("csv") || name.endsWith(".csv")) {
    return { src: GED_ICONS.csv, alt: "CSV" };
  }
  if (
    mime.includes("sheet") ||
    mime.includes("excel") ||
    name.endsWith(".xls") ||
    name.endsWith(".xlsx")
  ) {
    return { src: GED_ICONS.excel, alt: "Excel" };
  }
  if (
    mime.includes("word") ||
    mime.includes("msword") ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return { src: GED_ICONS.word, alt: "Word" };
  }
  if (
    mime.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif)$/.test(name)
  ) {
    return { src: GED_ICONS.image, alt: "Image" };
  }
  if (mime.includes("text/plain") || name.endsWith(".txt")) {
    return { src: GED_ICONS.text, alt: "Texte" };
  }

  return { src: GED_ICONS.file, alt: "Fichier" };
}
