import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo/db";
import CandidatureModel from "@/lib/mongo/models/candidature.model";
import RecrutementModel from "@/lib/mongo/models/recrutement.model";
import {
  CMS_CLOUDINARY_ROOT,
  CMS_PDF_MIME_TYPES,
} from "@/lib/constants/cms";
import { CANDIDATURE_CV_MAX_BYTES } from "@/lib/constants/candidature";
import { uploadCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";
import { generateCandidatureReference } from "@/lib/services/candidature/generate-reference";
import { serializeCandidature } from "@/lib/services/candidature/serialize-candidature";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isPdf(file: File) {
  return (
    CMS_PDF_MIME_TYPES.includes(file.type as (typeof CMS_PDF_MIME_TYPES)[number]) ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

async function uploadPdf(file: File, folder: string) {
  if (file.size > CANDIDATURE_CV_MAX_BYTES) {
    throw new Error("Le fichier ne doit pas dépasser 5 Mo");
  }
  if (!isPdf(file)) {
    throw new Error("Seuls les fichiers PDF sont acceptés");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const upload = await uploadCmsAsset({
    buffer,
    folder: `${CMS_CLOUDINARY_ROOT}/${folder}`,
    filename: file.name,
    resourceType: "raw",
  });

  return {
    url: upload.secureUrl,
    publicId: upload.publicId,
    fileName: file.name,
  };
}

export async function GET(req: Request) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const offreSlug = searchParams.get("offreSlug");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (offreSlug) filter.offreSlug = offreSlug;

  const items = await CandidatureModel.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: items.map(serializeCandidature) });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const offreSlug = String(formData.get("offreSlug") ?? "").trim();
    const civilite = String(formData.get("civilite") ?? "M.").trim();
    const nom = String(formData.get("nom") ?? "").trim();
    const prenom = String(formData.get("prenom") ?? "").trim();
    const dateNaissance = String(formData.get("dateNaissance") ?? "").trim();
    const lieuNaissance = String(formData.get("lieuNaissance") ?? "").trim();
    const nationalite = String(formData.get("nationalite") ?? "").trim();
    const adresse = String(formData.get("adresse") ?? "").trim();
    const telephone = String(formData.get("telephone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const niveauEtude = String(formData.get("niveauEtude") ?? "").trim();
    const domaineExpertise = String(formData.get("domaineExpertise") ?? "").trim();
    const anneesExperience = String(formData.get("anneesExperience") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const consentementDonnees = formData.get("consentementDonnees") === "true";

    if (!offreSlug) {
      return NextResponse.json({ error: "Offre manquante" }, { status: 400 });
    }
    if (!nom || !prenom || !email || !telephone) {
      return NextResponse.json({ error: "Informations incomplètes" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (!consentementDonnees) {
      return NextResponse.json({ error: "Consentement obligatoire" }, { status: 400 });
    }

    const cv = formData.get("cv");
    if (!(cv instanceof File)) {
      return NextResponse.json({ error: "Le CV est obligatoire" }, { status: 400 });
    }

    await connectDB();

    const isSpontanee = offreSlug === "spontanee";
    let offreReference: string | undefined;
    let offreTitle: string | undefined;

    if (!isSpontanee) {
      const offre = await RecrutementModel.findOne({
        slug: offreSlug,
        status: "publie",
        offerStatus: "ouvert",
      }).lean();

      if (!offre) {
        return NextResponse.json({ error: "Offre introuvable ou fermée" }, { status: 404 });
      }

      offreReference = offre.references;
      offreTitle = offre.title;
    } else {
      offreTitle = "Candidature spontanée";
    }

    const cvUpload = await uploadPdf(cv, "candidatures");
    let lettreUpload: { url: string; publicId: string; fileName: string } | undefined;

    const lettre = formData.get("lettreMotivation");
    if (lettre instanceof File && lettre.size > 0) {
      lettreUpload = await uploadPdf(lettre, "candidatures");
    }

    const reference = await generateCandidatureReference();

    const item = await CandidatureModel.create({
      reference,
      offreSlug,
      offreReference,
      offreTitle,
      isSpontanee,
      civilite,
      nom,
      prenom,
      dateNaissance,
      lieuNaissance,
      nationalite,
      adresse,
      telephone,
      email,
      niveauEtude,
      domaineExpertise,
      anneesExperience,
      cvUrl: cvUpload.url,
      cvPublicId: cvUpload.publicId,
      cvFileName: cvUpload.fileName,
      lettreMotivationUrl: lettreUpload?.url,
      lettreMotivationPublicId: lettreUpload?.publicId,
      lettreMotivationFileName: lettreUpload?.fileName,
      message: message || undefined,
      consentementDonnees,
      status: "nouvelle",
    });

    return NextResponse.json(
      { success: true, reference, item: serializeCandidature(item) },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de l'envoi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
