import { Resend } from "resend";

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

export async function sendMessageEmail({
  email,
  fullname,
  subject,
  message,
}: {
  email: string;
  fullname: string;
  subject: string;
  message: string;
}) {
  const resend = getResendClient();
  const from =
    process.env.RESEND_FROM_EMAIL ?? "INP Intranet <support@inpsenegal.sn>";

  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
        <p>Bonjour <strong>${escapeHtml(fullname)}</strong>,</p>
        <p>${safeMessage}</p>
        <p style="margin-top: 24px; font-size: 14px; color: #666;">
          Cordialement,<br/>Institut National de Pédologie
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
