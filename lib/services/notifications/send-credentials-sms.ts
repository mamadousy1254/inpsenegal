import {
  isValidSenegalPhone,
  normalizeSenegalPhone,
} from "@/lib/constants/phone";

export async function sendCredentialsSms({
  phone,
  fullname,
  email,
  password,
  loginUrl,
}: {
  phone: string;
  fullname: string;
  email: string;
  password: string;
  loginUrl: string;
}) {
  const normalizedPhone = normalizeSenegalPhone(phone);

  if (!isValidSenegalPhone(normalizedPhone)) {
    throw new Error(
      "Numéro invalide. Il doit commencer par +221 suivi de 9 chiffres (ex. +221778417586).",
    );
  }

  const apiKey = process.env.AXIOMTEXT_API_KEY;
  const apiUrl = process.env.AXIOMTEXT_API_URL_MESSAGE;

  if (!apiKey || !apiUrl) {
    throw new Error("Configuration AxiomText manquante");
  }

  const message = `Bonjour ${fullname}, votre compte INP Intranet a ete cree. E-mail: ${email}. Mot de passe: ${password}. Connexion: ${loginUrl}`;

  const response = await fetch(`${apiUrl}message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      to: normalizedPhone,
      message,
      signature: "INP",
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      body || `Erreur AxiomText (${response.status})`,
    );
  }
}
