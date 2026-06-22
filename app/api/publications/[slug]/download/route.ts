import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo/db";
import PublicationModel from "@/lib/mongo/models/publication.model";
import {
  contentDispositionAttachment,
  contentDispositionInline,
  getCmsFileUrl,
  resolveCmsPdfFileName,
  stripBrokenCloudinaryAttachment,
} from "@/lib/services/cms/cms-file-download";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(req: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { searchParams } = new URL(req.url);
  const inline = searchParams.get("inline") === "1";

  await connectDB();

  const doc = await PublicationModel.findOne({
    slug,
    status: "publie",
  }).lean();

  if (!doc) {
    return NextResponse.json({ error: "Publication introuvable" }, { status: 404 });
  }

  const sourceUrl = stripBrokenCloudinaryAttachment(getCmsFileUrl(doc.pdfUrl) ?? "");

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

    const fileName = resolveCmsPdfFileName({
      title: doc.title,
      pdfFileName: doc.pdfFileName,
    });

    const contentType =
      inline
        ? "application/pdf"
        : upstream.headers.get("content-type") ?? "application/pdf";

    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": inline
          ? contentDispositionInline(fileName)
          : contentDispositionAttachment(fileName),
        "Cache-Control": "private, no-cache",
        ...(inline && { "X-Content-Type-Options": "nosniff" }),
      },
    });
  } catch {
    return NextResponse.json({ error: "Erreur lors du téléchargement" }, { status: 500 });
  }
}
