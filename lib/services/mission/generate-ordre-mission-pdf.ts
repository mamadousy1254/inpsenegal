import { jsPDF } from "jspdf";

import { MISSION_TRANSPORT_LABELS } from "@/lib/constants/mission";
import type { SerializedMission } from "@/lib/services/mission/serialize-mission";

export type OrdreMissionPdfInput = {
  mission: SerializedMission;
  participantUserId: string;
  /** Si renseigné, remplace le moyen de transport de la mission. */
  moyenTransportOverride?: string;
};

function formatDateFr(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function extractReferenceNumber(numero: string) {
  const match = numero.match(/(\d+)\s*$/);
  if (match) return match[1].padStart(4, "0");
  const digits = numero.replace(/\D/g, "");
  return (digits.slice(-4) || "0001").padStart(4, "0");
}

function buildDestinationLine(mission: SerializedMission) {
  const place = mission.adressePrecise?.trim()
    ? `${mission.destinationLabel} — ${mission.adressePrecise.trim()}`
    : mission.destinationLabel;
  const normalized = place.replace(/^à\s+/i, "").trim();
  return normalized ? `à ${normalized}` : "—";
}

function resolveTransportMean(
  mission: SerializedMission,
  override?: string,
): string {
  const trimmed = override?.trim();
  if (trimmed) return trimmed;

  const plates = (mission.transport.immatriculationsVehicules ?? [])
    .map((p) => p.trim())
    .filter(Boolean);
  if (plates.length > 0) {
    return plates.join(" / ");
  }

  if (mission.transport.immatriculation?.trim()) {
    return mission.transport.immatriculation.trim();
  }

  if (mission.transport.moyen) {
    return MISSION_TRANSPORT_LABELS[mission.transport.moyen];
  }

  return "";
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/images/logo-inp.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawField(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  labelWidth: number,
  maxWidth: number,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(label, x, y);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(value || "—", maxWidth - labelWidth);
  doc.text(lines, x + labelWidth, y);
  const lineHeight = 6;
  return y + Math.max(lineHeight, lines.length * lineHeight);
}

function ptToMm(pt: number) {
  return pt * 0.352778;
}

/**
 * Pointillés centrés horizontalement et verticalement entre deux blocs.
 * `upperBaseline` / `lowerBaseline` = baselines de la dernière / première ligne.
 * `upperFontPt` / `lowerFontPt` = tailles pour estimer la zone visuelle du texte.
 */
function drawDotsBetweenBlocks(
  doc: jsPDF,
  centerX: number,
  upperBaseline: number,
  upperFontPt: number,
  lowerBaseline: number,
  lowerFontPt: number,
  count = 15,
) {
  // Bas visuel du bloc du haut ≈ baseline + descente
  const upperBottom = upperBaseline + ptToMm(upperFontPt) * 0.22;
  // Haut visuel du bloc du bas ≈ baseline - montée
  const lowerTop = lowerBaseline - ptToMm(lowerFontPt) * 0.72;
  const midY = (upperBottom + lowerTop) / 2;

  const n = Math.min(count, 15);
  const spacing = 1.35;
  const totalWidth = (n - 1) * spacing;
  const startX = centerX - totalWidth / 2;
  doc.setFillColor(30);
  for (let i = 0; i < n; i++) {
    doc.circle(startX + i * spacing, midY, 0.28, "F");
  }
}

function drawCenteredLines(
  doc: jsPDF,
  lines: string[],
  centerX: number,
  startY: number,
  lineHeight: number,
  options?: { fontStyle?: "normal" | "bold" | "italic"; fontSize?: number },
): { firstY: number; lastY: number; nextY: number; fontSize: number } {
  const fontStyle = options?.fontStyle ?? "bold";
  const fontSize = options?.fontSize ?? 9;
  doc.setFont("helvetica", fontStyle);
  doc.setFontSize(fontSize);
  let y = startY;
  let lastY = startY;
  for (const line of lines) {
    doc.text(line, centerX, y, { align: "center" });
    lastY = y;
    y += lineHeight;
  }
  return { firstY: startY, lastY, nextY: y, fontSize };
}

export async function generateOrdreMissionPdf(
  input: OrdreMissionPdfInput,
): Promise<Blob> {
  const { mission, participantUserId, moyenTransportOverride } = input;
  const participant = mission.missionnaires.find(
    (m) => m.userId === participantUserId,
  );
  if (!participant) {
    throw new Error("Personne introuvable sur cette mission");
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 20;
  const marginRight = 20;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // Même Y pour le haut des deux colonnes (République ↔ N°)
  const topY = 16;
  const headerCenterX = marginLeft + 40;
  const gapBetweenBlocks = 8;

  // ——— Bloc 1 : République + devise ———
  const block1Title = drawCenteredLines(
    doc,
    ["REPUBLIQUE DU SENEGAL"],
    headerCenterX,
    topY,
    3.2,
    { fontStyle: "bold", fontSize: 10 },
  );
  const block1Motto = drawCenteredLines(
    doc,
    ["Un Peuple – Un But – Une Foi"],
    headerCenterX,
    block1Title.lastY + 3.2,
    3.2,
    { fontStyle: "italic", fontSize: 8.5 },
  );
  const block1End = block1Motto.lastY;

  // ——— Bloc 2 : Ministère (3 lignes) ———
  const block2Start = block1End + gapBetweenBlocks;
  const block2 = drawCenteredLines(
    doc,
    [
      "MINISTERE DE L'AGRICULTURE",
      "DE LA SOUVERAINETE ALIMENTAIRE",
      "ET DE L'ELEVAGE",
    ],
    headerCenterX,
    block2Start,
    3.6,
    { fontStyle: "bold", fontSize: 8.5 },
  );

  drawDotsBetweenBlocks(
    doc,
    headerCenterX,
    block1End,
    block1Motto.fontSize,
    block2.firstY,
    block2.fontSize,
  );

  // ——— Bloc 3 : INP ———
  const block3Start = block2.lastY + gapBetweenBlocks;
  const block3 = drawCenteredLines(
    doc,
    ["INSTITUT NATIONAL DE PEDOLOGIE"],
    headerCenterX,
    block3Start,
    3.6,
    { fontStyle: "bold", fontSize: 9.5 },
  );

  drawDotsBetweenBlocks(
    doc,
    headerCenterX,
    block2.lastY,
    block2.fontSize,
    block3.firstY,
    block3.fontSize,
  );

  // LE DIRECTEUR GENERAL aligné sous INSTITUT NATIONAL DE PEDOLOGIE
  const directeurY = block3.lastY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("LE DIRECTEUR GENERAL", headerCenterX, directeurY, {
    align: "center",
  });

  // ——— Colonne droite : même topY que REPUBLIQUE, logo dessous ———
  const ref = extractReferenceNumber(mission.numero);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`N° ${ref} /MASAE/INP`, pageWidth - marginRight, topY, {
    align: "right",
  });

  const logo = await loadLogoDataUrl();
  const logoTop = topY + 4;
  if (logo) {
    doc.addImage(logo, "PNG", pageWidth - marginRight - 28, logoTop, 26, 26);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("INP", pageWidth - marginRight - 10, logoTop + 16, {
      align: "right",
    });
  }

  // "Dakar, le" décalé à gauche pour laisser de la place au cachet
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Dakar, le", pageWidth - marginRight - 28, directeurY, {
    align: "right",
  });

  // Titre
  let y = directeurY + 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ORDRE DE MISSION", pageWidth / 2, y, { align: "center" });
  const titleWidth = doc.getTextWidth("ORDRE DE MISSION");
  doc.setLineWidth(0.5);
  doc.line(
    pageWidth / 2 - titleWidth / 2,
    y + 1.5,
    pageWidth / 2 + titleWidth / 2,
    y + 1.5,
  );

  // Champs
  y += 18;
  const labelWidth = 48;
  const fields: Array<[string, string]> = [
    ["Nom et Prénom :", participant.fullname],
    ["Grade :", participant.grade?.trim() || "—"],
    ["Fonction :", participant.occupation || "—"],
    ["Se rendre :", buildDestinationLine(mission)],
    ["Objet de la mission :", mission.objet],
    ["Prise en charge :", "PDCVR"],
    ["Date de départ :", `le ${formatDateFr(mission.dateDepart)}`],
    ["Date de retour :", `le ${formatDateFr(mission.dateRetour)}`],
    [
      "Moyen de transport :",
      resolveTransportMean(mission, moyenTransportOverride) || "—",
    ],
  ];

  for (const [label, value] of fields) {
    y = drawField(doc, label, value, marginLeft, y, labelWidth, contentWidth);
    y += 5;
  }

  // Zone signature
  y = Math.max(y + 16, 210);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Le Directeur Général", pageWidth - marginRight - 10, y, {
    align: "right",
  });
  doc.setDrawColor(180);
  doc.rect(pageWidth - marginRight - 55, y + 4, 50, 32);

  // Pied de page
  const footerY = 275;
  doc.setDrawColor(60);
  doc.setLineWidth(0.3);
  doc.line(marginLeft, footerY, pageWidth - marginRight, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "Institut National de Pédologie (INP) – Hann Mariste – Dakar – BP 10 709 tél : (221) 33 832 65 65 fax : (221) 33 832 85 17",
    pageWidth / 2,
    footerY + 6,
    { align: "center" },
  );
  doc.text(
    "Email : pedologie.inp@agriculture.gouv.sn    Site web : www.inpsenegal.sn",
    pageWidth / 2,
    footerY + 11,
    { align: "center" },
  );

  return doc.output("blob");
}

export function downloadOrdreMissionPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildOrdreMissionFilename(
  mission: SerializedMission,
  fullname: string,
) {
  const safeName = fullname
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `ordre-mission-${mission.numero}-${safeName || "agent"}.pdf`;
}
