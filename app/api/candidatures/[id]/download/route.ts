import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongo/db";
import CandidatureModel from "@/lib/mongo/models/candidature.model";
import {
  contentDispositionAttachment,
  resolveCmsPdfFileName,
  stripBrokenCloudinaryAttachment,
} from "@/lib/services/cms/cms-file-download";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";

type RouteContext = { params: Promise<{ id: string }> };

function resolveCandidatureFileName(input: {
  kind: "cv" | "lettre";
  prenom: string;
  nom: string;
  fileName?: string | null;
}) {
  if (input.fileName?.trim()) {
    return input.fileName.trim();
  }

  const base = `${input.prenom}-${input.nom}-${input.kind}`.replace(/\s+/g, "-");
  return resolveCmsPdfFileName({ title: base, pdfFileName: undefined });
}

export async function GET(req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  const { searchParams } = new URL(req.url);
  const fileKind = searchParams.get("file") === "lettre" ? "lettre" : "cv";

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();

  const doc = await CandidatureModel.findById(id).lean();
  if (!doc) {
    return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
  }

  const sourceUrl = stripBrokenCloudinaryAttachment(
    fileKind === "lettre" ? (doc.lettreMotivationUrl ?? "") : (doc.cvUrl ?? ""),
  );

  if (!sourceUrl) {
    return NextResponse.json({ error: "Aucun fichier disponible" }, { status: 404 });
  }

  try {
    const upstream = await fetch(sourceUrl);
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Impossible de récupérer le fichier" },
        { status: 502 },
      );
    }

    const fileName = resolveCandidatureFileName({
      kind: fileKind,
      prenom: doc.prenom,
      nom: doc.nom,
      fileName: fileKind === "lettre" ? doc.lettreMotivationFileName : doc.cvFileName,
    });

    const contentType = upstream.headers.get("content-type") ?? "application/pdf";

    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDispositionAttachment(fileName),
        "Cache-Control": "private, no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Erreur lors du téléchargement" }, { status: 500 });
  }
}
