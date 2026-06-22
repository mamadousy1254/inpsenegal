import { Resend } from "resend";
import {
  ANALYSIS_REQUEST_NOTIFY_EMAIL,
  ANALYSIS_SEND_MODES,
} from "@/lib/constants/demande-analyse";
import type { SerializedDemandeAnalyse } from "@/lib/services/demande-analyse/serialize-demande-analyse";

function getResendClient() {
  const apiKey =
    process.env.RESEND_API_KEY ?? process.env.RESEND_GSTHIASS_API_KEY;

  if (!apiKey) {
    throw new Error("Clé API Resend non configurée");
  }

  return new Resend(apiKey);
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sendModeLabel(value?: string) {
  if (!value) return "—";
  return ANALYSIS_SEND_MODES.find((mode) => mode.value === value)?.label ?? value;
}

function row(label: string, value?: string | null) {
  if (!value?.trim()) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:500;">${escapeHtml(value)}</td></tr>`;
}

export async function notifyAnalysisRequestSubmitted(item: SerializedDemandeAnalyse) {
  const resend = getResendClient();
  const from =
    process.env.RESEND_FROM_EMAIL ?? "INP Intranet <support@gsthiass.com>";

  const fullName = `${item.firstName} ${item.lastName}`;
  const analyses = item.analysisTypes.length
    ? item.analysisTypes.map((a) => `• ${escapeHtml(a)}`).join("<br/>")
    : "—";

  const html = `
    <div style="font-family:sans-serif;line-height:1.6;color:#1a1a1a;max-width:640px;">
      <h2 style="color:#1F3D2B;margin:0 0 12px;">Nouvelle demande d'analyse de sol</h2>
      <p style="margin:0 0 16px;">Une demande vient d'être soumise sur le site public.</p>
      <p style="margin:0 0 20px;"><strong>Référence :</strong> ${escapeHtml(item.reference)}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        ${row("Demandeur", fullName)}
        ${row("Email", item.email)}
        ${row("Téléphone", item.phone)}
        ${row("Type", item.requesterType)}
        ${row("Localisation", `${item.commune}, ${item.department}, ${item.region}`)}
        ${row("Superficie (ha)", item.surface)}
        ${row("GPS", item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : undefined)}
        ${row("Culture prévue", item.culturePlanned)}
        ${row("Culture actuelle", item.cultureCurrent)}
        ${row("Irrigation", item.irrigation)}
        ${row("Problème", item.problem)}
        ${row("Échantillons", item.samplesNumber)}
        ${row("Mode d'envoi", sendModeLabel(item.sendMode))}
        ${row("Date prévue", item.depositDate)}
      </table>
      <p style="margin:20px 0 8px;font-weight:600;">Types d'analyse :</p>
      <p style="margin:0 0 20px;">${analyses}</p>
      <p style="font-size:13px;color:#666;">
        Consultez le tableau de bord INP pour le suivi complet.
      </p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from,
    to: ANALYSIS_REQUEST_NOTIFY_EMAIL,
    subject: `[INP] Nouvelle demande d'analyse — ${item.reference}`,
    html,
    replyTo: item.email,
  });

  if (error) {
    throw new Error(error.message);
  }
}
