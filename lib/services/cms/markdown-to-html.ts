/**
 * Convertit le contenu markdown simplifié des actualités statiques en HTML
 * compatible avec le rendu WYSIWYG du site public.
 */
export function markdownActualiteToHtml(md: string): string {
  const lines = md.split("\n");
  const parts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      parts.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(formatInline(lines[i].trim().slice(2)));
        i += 1;
      }
      parts.push(`<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(formatInline(lines[i].trim().replace(/^\d+\.\s/, "")));
        i += 1;
      }
      parts.push(`<ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>`);
      continue;
    }

    parts.push(`<p>${formatInline(trimmed)}</p>`);
    i += 1;
  }

  return parts.join("");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(text: string): string {
  const escaped = escapeHtml(text);
  return escaped.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>",
  );
}
