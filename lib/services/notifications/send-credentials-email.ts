import { Resend } from "resend";

function getResendClient() {
  const apiKey =
    process.env.RESEND_API_KEY ?? process.env.RESEND_GSTHIASS_API_KEY;

  if (!apiKey) {
    throw new Error("Clé API Resend non configurée");
  }

  return new Resend(apiKey);
}

export async function sendCredentialsEmail({
  email,
  fullname,
  password,
  loginUrl,
}: {
  email: string;
  fullname: string;
  password: string;
  loginUrl: string;
}) {
  const resend = getResendClient();
  const from =
    process.env.RESEND_FROM_EMAIL ?? "INP Intranet <support@inpsenegal.sn>";

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Vos identifiants INP Intranet",
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
        <p>Bonjour <strong>${fullname}</strong>,</p>
        <p>Votre compte sur l'intranet INP a été créé. Voici vos identifiants de connexion :</p>
        <ul>
          <li><strong>E-mail :</strong> ${email}</li>
          <li><strong>Mot de passe :</strong> ${password}</li>
        </ul>
        <p>
          <a href="${loginUrl}" style="display:inline-block;padding:10px 16px;background:#166534;color:#fff;text-decoration:none;border-radius:6px;">
            Accéder à la page de connexion
          </a>
        </p>
        <p style="font-size: 14px; color: #666;">
          Lien direct : <a href="${loginUrl}">${loginUrl}</a>
        </p>
        <p style="font-size: 14px; color: #666;">
          Conservez ces identifiants en lieu sûr. Pour toute modification de mot de passe, contactez les RH ou l&apos;administration.
        </p>
        <p>Cordialement,<br/>Institut National de Pédologie</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
