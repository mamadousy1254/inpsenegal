import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongo/db";
import DocumentationResourceModel from "@/lib/mongo/models/documentation-resource.model";
import {
  resolveDocumentationDownloadFileName,
  stripBrokenCloudinaryAttachment,
} from "@/lib/services/documentation/documentation-download";
import { serializeDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

type RouteContext = { params: Promise<{ id: string }> };

function contentDispositionFileName(fileName: string) {
  const ascii = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  const encoded = encodeURIComponent(fileName);
  return { ascii, encoded };
}

function contentDispositionAttachment(fileName: string) {
  const { ascii, encoded } = contentDispositionFileName(fileName);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

function contentDispositionInline(fileName: string) {
  const { ascii, encoded } = contentDispositionFileName(fileName);
  return `inline; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

export async function GET(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const { searchParams } = new URL(req.url);
  const inline = searchParams.get("inline") === "1";

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();

  const doc = await DocumentationResourceModel.findOne({
    _id: id,
    status: "publie",
  }).lean();

  if (!doc) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const item = serializeDocumentationResource(doc);
  const sourceUrl = stripBrokenCloudinaryAttachment(
    item.pdfUrl || item.downloadUrl || "",
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

    const fileName = resolveDocumentationDownloadFileName(item);
    const isPdf = Boolean(item.pdfUrl) || fileName.toLowerCase().endsWith(".pdf");
    const contentType =
      inline && isPdf
        ? "application/pdf"
        : upstream.headers.get("content-type") ??
          (isPdf ? "application/pdf" : "application/octet-stream");

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
