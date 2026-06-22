import { Resend } from "resend";
import {
  CONTACT_DASHBOARD_URL,
  CONTACT_NOTIFY_EMAIL,
} from "@/lib/constants/contact-message";
import type { SerializedContactMessage } from "@/lib/services/contact/serialize-contact-message";

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

function row(label: string, value?: string | null) {
  if (!value?.trim()) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:500;">${escapeHtml(value)}</td></tr>`;
}

function getSiteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function notifyContactMessageSubmitted(item: SerializedContactMessage) {
  const resend = getResendClient();
  const from =
    process.env.RESEND_FROM_EMAIL ?? "INP Intranet <support@inpsenegal.sn>";
  const dashboardUrl = `${getSiteOrigin()}${CONTACT_DASHBOARD_URL}`;

  const html = `
    <div style="font-family:sans-serif;line-height:1.6;color:#1a1a1a;max-width:640px;">
      <h2 style="color:#7B4F2A;margin:0 0 12px;">Nouveau message de contact</h2>
      <p style="margin:0 0 16px;">Un visiteur vient d'envoyer un message via le formulaire de contact du site.</p>
      <p style="margin:0 0 20px;"><strong>Référence :</strong> ${escapeHtml(item.reference)}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        ${row("Nom", item.fullName)}
        ${row("Institution", item.institution)}
        ${row("Email", item.email)}
        ${row("Téléphone", item.phone)}
        ${row("Objet", item.subject)}
      </table>
      <p style="margin:20px 0 8px;font-weight:600;">Message :</p>
      <p style="margin:0 0 20px;padding:12px;background:#F8F1E0;border-radius:8px;white-space:pre-wrap;">${escapeHtml(item.message)}</p>
      <p style="font-size:13px;color:#666;">
        <a href="${escapeHtml(dashboardUrl)}" style="color:#7B4F2A;">Ouvrir le tableau de bord</a>
        pour traiter ce message.
      </p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from,
    to: CONTACT_NOTIFY_EMAIL,
    subject: `[INP] Nouveau message contact — ${item.reference}`,
    html,
    replyTo: item.email,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function notifyContactMessageAcknowledgment(item: SerializedContactMessage) {
  const resend = getResendClient();
  const from =
    process.env.RESEND_FROM_EMAIL ?? "INP Intranet <support@inpsenegal.sn>";

  const html = `
    <div style="font-family:sans-serif;line-height:1.6;color:#1a1a1a;max-width:640px;">
      <h2 style="color:#7B4F2A;margin:0 0 12px;">Message bien reçu</h2>
      <p>Bonjour ${escapeHtml(item.fullName)},</p>
      <p>
        Nous avons bien reçu votre message adressé à l'Institut national de Pédologie.
        Votre numéro de référence est <strong>${escapeHtml(item.reference)}</strong>.
      </p>
      <p style="margin:16px 0 8px;font-weight:600;">Rappel de votre demande :</p>
      <p style="margin:0;padding:12px;background:#F8F1E0;border-radius:8px;">
        <strong>${escapeHtml(item.subject)}</strong><br/>
        <span style="white-space:pre-wrap;">${escapeHtml(item.message)}</span>
      </p>
      <p style="margin-top:20px;font-size:13px;color:#666;">
        Notre équipe vous répondra dans les meilleurs délais.
      </p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from,
    to: item.email,
    subject: `INP — Accusé de réception de votre message (${item.reference})`,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
