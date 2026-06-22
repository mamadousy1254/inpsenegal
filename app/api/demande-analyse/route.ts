import { NextResponse } from "next/server";

// Route Handler serveur — réception du formulaire « Demande d'analyse de sol ».
// Sécurité : l'insertion se fait UNIQUEMENT côté serveur via la clé service_role
// (jamais exposée au client). En l'absence de configuration Supabase/Resend, la
// route répond quand même (référence locale) afin que le formulaire reste testable
// en développement — les variables d'environnement activent la persistance + emails.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "INP <onboarding@resend.dev>";
const INP_NOTIFY_EMAIL = process.env.INP_NOTIFY_EMAIL || "inppedologie@gmail.com";

type Payload = Record<string, unknown>;

function champ(p: Payload, k: string): string {
  const v = p[k];
  return typeof v === "string" ? v.trim() : "";
}

function liste(p: Payload, k: string): string[] {
  const v = p[k];
  return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
}

/** Validation serveur (ne jamais faire confiance au client). */
function valider(p: Payload): string | null {
  const email = champ(p, "email");
  if (!champ(p, "nom")) return "Nom manquant.";
  if (!champ(p, "prenom")) return "Prénom manquant.";
  if (!champ(p, "telephone")) return "Téléphone manquant.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email invalide.";
  if (!champ(p, "type_demandeur")) return "Type de demandeur manquant.";
  if (!champ(p, "delegation")) return "Délégation manquante.";
  if (!champ(p, "region") || !champ(p, "departement") || !champ(p, "commune"))
    return "Localisation incomplète.";
  if (!champ(p, "objectif")) return "Objectif manquant.";
  const n = Number(champ(p, "nombre_echantillons"));
  if (!Number.isInteger(n) || n < 1) return "Nombre d'échantillons invalide.";
  if (liste(p, "profondeurs").length === 0) return "Aucune profondeur sélectionnée.";
  if (liste(p, "analyses").length === 0) return "Aucun type d'analyse sélectionné.";
  if (!champ(p, "mode_remise")) return "Mode de remise manquant.";
  if (!champ(p, "mode_reception")) return "Mode de réception manquant.";
  if (p["consentement"] !== true) return "Consentement obligatoire.";
  return null;
}

/** Insertion via la fonction RPC (référence générée atomiquement côté Postgres). */
async function insererSupabase(p: Payload): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/inserer_demande_analyse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY as string,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ p }),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Supabase RPC ${res.status} : ${detail}`);
  }
  // PostgREST renvoie le scalaire JSON (la référence text).
  const ref = await res.json();
  return typeof ref === "string" ? ref : String(ref);
}

function referenceLocale(): string {
  const annee = new Date().getFullYear();
  const n = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  return `INP-${annee}-${n}`;
}

/** Envoi d'un email via Resend (REST). Les échecs sont non bloquants. */
async function envoyerEmail(to: string | string[], subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to, subject, html }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

function recapHtml(ref: string, p: Payload): string {
  const analyses = liste(p, "analyses").join(", ");
  const loc = [champ(p, "commune"), champ(p, "departement"), champ(p, "region")]
    .filter(Boolean)
    .join(", ");
  return `
    <div style="font-family:Arial,sans-serif;color:#2A1F18;line-height:1.6">
      <h2 style="color:#7B4F2A;margin:0 0 4px">Demande d'analyse de sol — ${ref}</h2>
      <p style="margin:0 0 16px;color:#5A4733">Institut national de Pédologie (INP)</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:4px 8px;color:#8B7355">Demandeur</td><td style="padding:4px 8px"><strong>${champ(p, "prenom")} ${champ(p, "nom")}</strong></td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Type</td><td style="padding:4px 8px">${champ(p, "type_demandeur")}${champ(p, "structure") ? " — " + champ(p, "structure") : ""}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Téléphone</td><td style="padding:4px 8px">${champ(p, "telephone")}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Email</td><td style="padding:4px 8px">${champ(p, "email")}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Délégation</td><td style="padding:4px 8px">${champ(p, "delegation")}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Localisation</td><td style="padding:4px 8px">${loc}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Objectif</td><td style="padding:4px 8px">${champ(p, "objectif")}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Échantillons</td><td style="padding:4px 8px">${champ(p, "nombre_echantillons")}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Analyses</td><td style="padding:4px 8px">${analyses}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Mode de remise</td><td style="padding:4px 8px">${champ(p, "mode_remise")}</td></tr>
        <tr><td style="padding:4px 8px;color:#8B7355">Réception résultats</td><td style="padding:4px 8px">${champ(p, "mode_reception")}</td></tr>
      </table>
    </div>`;
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Corps de requête invalide." }, { status: 400 });
  }

  const erreur = valider(payload);
  if (erreur) {
    return NextResponse.json({ ok: false, error: erreur }, { status: 400 });
  }

  // ── Persistance ──
  let reference: string;
  let persisted = false;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      reference = await insererSupabase(payload);
      persisted = true;
    } catch (e) {
      console.error("[demande-analyse] échec persistance Supabase :", e);
      return NextResponse.json(
        { ok: false, error: "Enregistrement impossible pour le moment. Veuillez réessayer." },
        { status: 502 },
      );
    }
  } else {
    // Pas de configuration Supabase (dev) — référence locale, pas de persistance.
    reference = referenceLocale();
  }

  // ── Emails (non bloquants) ──
  let emailed = false;
  if (RESEND_API_KEY) {
    const html = recapHtml(reference, payload);
    const [accuse] = await Promise.all([
      envoyerEmail(
        champ(payload, "email"),
        `INP — Accusé de réception de votre demande d'analyse (${reference})`,
        `<p>Bonjour ${champ(payload, "prenom")},</p>
         <p>Nous avons bien reçu votre demande d'analyse de sol. Votre numéro de référence est
         <strong>${reference}</strong>. L'INP vous recontactera pour la suite.</p>${html}`,
      ),
      envoyerEmail(
        INP_NOTIFY_EMAIL,
        `Nouvelle demande d'analyse — ${reference}`,
        html,
      ),
    ]);
    emailed = accuse;
  }

  return NextResponse.json({ ok: true, reference, persisted, emailed });
}
