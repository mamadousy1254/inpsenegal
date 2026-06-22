"use client";

import type { Publication, Actualite } from "@/types";

const PARSE_APP_ID = process.env.NEXT_PUBLIC_PARSE_APP_ID ?? "";
const PARSE_JS_KEY = process.env.NEXT_PUBLIC_PARSE_JS_KEY ?? "";
const PARSE_SERVER_URL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL ?? "https://parseapi.back4app.com";

async function getParse(): Promise<any> {
  if (typeof window === "undefined") return null;
  const Parse = (await import("parse/dist/parse.min.js")).default;
  if (PARSE_APP_ID && PARSE_JS_KEY) {
    Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
    Parse.serverURL = PARSE_SERVER_URL;
  }
  return Parse;
}

export async function getPublications(limit = 6): Promise<Publication[]> {
  try {
    const Parse = await getParse();
    if (!Parse) return [];
    const query = new Parse.Query("Publication");
    query.descending("createdAt");
    query.limit(limit);
    const results = await query.find();
    return results.map((r: { id: string; get: (key: string) => unknown }) => ({
      objectId: r.id,
      title: String(r.get("title") ?? ""),
      summary: r.get("summary") as string | undefined,
      file: r.get("file") as { url: string } | undefined,
      year: r.get("year") as number | undefined,
      category: r.get("category") as string | undefined,
      createdAt: (r.get("createdAt") as { toISOString?: () => string })?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: (r.get("updatedAt") as { toISOString?: () => string })?.toISOString?.(),
    }));
  } catch {
    return [];
  }
}

export async function getActualites(limit = 6): Promise<Actualite[]> {
  try {
    const Parse = await getParse();
    if (!Parse) return [];
    const query = new Parse.Query("Actualite");
    query.descending("publishedAt");
    query.limit(limit);
    const results = await query.find();
    return results.map((r: { id: string; get: (key: string) => unknown }) => ({
      objectId: r.id,
      title: String(r.get("title") ?? ""),
      excerpt: r.get("excerpt") as string | undefined,
      content: r.get("content") as string | undefined,
      image: r.get("image") as { url: string } | undefined,
      publishedAt: (r.get("publishedAt") as { toISOString?: () => string })?.toISOString?.() ?? (r.get("createdAt") as { toISOString?: () => string })?.toISOString?.(),
      slug: r.get("slug") as string | undefined,
      createdAt: (r.get("createdAt") as { toISOString?: () => string })?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: (r.get("updatedAt") as { toISOString?: () => string })?.toISOString?.(),
    }));
  } catch {
    return [];
  }
}

export async function createActualite(data: {
  title: string;
  excerpt?: string;
  content?: string;
  slug?: string;
  publishedAt?: Date;
  imageBase64?: string;
  imageName?: string;
}): Promise<boolean> {
  try {
    const Parse = await getParse();
    if (!Parse) return false;

    const Actualite = Parse.Object.extend("Actualite");
    const actualite = new Actualite();

    actualite.set("title", data.title);
    if (data.excerpt) actualite.set("excerpt", data.excerpt);
    if (data.content) actualite.set("content", data.content);
    if (data.slug) actualite.set("slug", data.slug);
    if (data.publishedAt) actualite.set("publishedAt", data.publishedAt);

    if (data.imageBase64 && data.imageName) {
      const file = new Parse.File(data.imageName, { base64: data.imageBase64 });
      await file.save();
      actualite.set("image", file);
    }

    await actualite.save();
    return true;
  } catch (error) {
    console.error("Error creating Actualite:", error);
    return false;
  }
}

export async function deleteActualite(objectId: string): Promise<boolean> {
  try {
    const Parse = await getParse();
    if (!Parse) return false;

    const query = new Parse.Query("Actualite");
    const actualite = await query.get(objectId);
    await actualite.destroy();
    return true;
  } catch (error) {
    console.error("Error deleting Actualite:", error);
    return false;
  }
}

export async function getActualiteById(objectId: string): Promise<Actualite | null> {
  try {
    const Parse = await getParse();
    if (!Parse) return null;

    const query = new Parse.Query("Actualite");
    const r = await query.get(objectId);
    return {
      objectId: r.id,
      title: String(r.get("title") ?? ""),
      excerpt: r.get("excerpt") as string | undefined,
      content: r.get("content") as string | undefined,
      image: r.get("image") as { url: string } | undefined,
      publishedAt: (r.get("publishedAt") as { toISOString?: () => string })?.toISOString?.() ?? (r.get("createdAt") as { toISOString?: () => string })?.toISOString?.(),
      slug: r.get("slug") as string | undefined,
      createdAt: (r.get("createdAt") as { toISOString?: () => string })?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: (r.get("updatedAt") as { toISOString?: () => string })?.toISOString?.(),
    };
  } catch (error) {
    console.error("Error getting Actualite by ID:", error);
    return null;
  }
}

export async function updateActualite(
  objectId: string,
  data: {
    title: string;
    excerpt?: string;
    content?: string;
    slug?: string;
    publishedAt?: Date;
    imageBase64?: string;
    imageName?: string;
  }
): Promise<boolean> {
  try {
    const Parse = await getParse();
    if (!Parse) return false;

    const query = new Parse.Query("Actualite");
    const actualite = await query.get(objectId);

    actualite.set("title", data.title);
    if (data.excerpt !== undefined) actualite.set("excerpt", data.excerpt);
    if (data.content !== undefined) actualite.set("content", data.content);
    if (data.slug !== undefined) actualite.set("slug", data.slug);
    if (data.publishedAt !== undefined) actualite.set("publishedAt", data.publishedAt);

    if (data.imageBase64 && data.imageName) {
      const file = new Parse.File(data.imageName, { base64: data.imageBase64 });
      await file.save();
      actualite.set("image", file);
    }

    await actualite.save();
    return true;
  } catch (error) {
    console.error("Error updating Actualite:", error);
    return false;
  }
}

export async function createPublication(data: {
  title: string;
  summary?: string;
  year?: number;
  category?: string;
  fileBase64?: string;
  fileName?: string;
}): Promise<boolean> {
  try {
    const Parse = await getParse();
    if (!Parse) return false;

    const Publication = Parse.Object.extend("Publication");
    const publication = new Publication();

    publication.set("title", data.title);
    if (data.summary) publication.set("summary", data.summary);
    if (data.year) publication.set("year", data.year);
    if (data.category) publication.set("category", data.category);

    if (data.fileBase64 && data.fileName) {
      const file = new Parse.File(data.fileName, { base64: data.fileBase64 });
      await file.save();
      publication.set("file", file);
    }

    await publication.save();
    return true;
  } catch (error) {
    console.error("Error creating Publication:", error);
    return false;
  }
}

export async function deletePublication(objectId: string): Promise<boolean> {
  try {
    const Parse = await getParse();
    if (!Parse) return false;

    const query = new Parse.Query("Publication");
    const publication = await query.get(objectId);
    await publication.destroy();
    return true;
  } catch (error) {
    console.error("Error deleting Publication:", error);
    return false;
  }
}

export async function getProjets(limit = 10): Promise<any[]> {
  try {
    const Parse = await getParse();
    if (!Parse) return [];
    const query = new Parse.Query("Projet");
    query.descending("startDate");
    query.limit(limit);
    const results = await query.find();
    return results.map((r: { id: string; get: (key: string) => unknown }) => ({
      objectId: r.id,
      title: String(r.get("title") ?? ""),
      status: r.get("status") as string | undefined,
      partner: r.get("partner") as string | undefined,
      startDate: (r.get("startDate") as { toISOString?: () => string })?.toISOString?.() ?? (r.get("createdAt") as { toISOString?: () => string })?.toISOString?.(),
      createdAt: (r.get("createdAt") as { toISOString?: () => string })?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: (r.get("updatedAt") as { toISOString?: () => string })?.toISOString?.(),
    }));
  } catch {
    return [];
  }
}

export async function createProjet(data: {
  title: string;
  status: string;
  partner?: string;
  startDate?: Date;
}): Promise<boolean> {
  try {
    const Parse = await getParse();
    if (!Parse) return false;

    const Projet = Parse.Object.extend("Projet");
    const projet = new Projet();

    projet.set("title", data.title);
    if (data.status) projet.set("status", data.status);
    if (data.partner) projet.set("partner", data.partner);
    if (data.startDate) projet.set("startDate", data.startDate);

    await projet.save();
    return true;
  } catch (error) {
    console.error("Error creating Projet:", error);
    return false;
  }
}

export async function deleteProjet(objectId: string): Promise<boolean> {
  try {
    const Parse = await getParse();
    if (!Parse) return false;

    const query = new Parse.Query("Projet");
    const projet = await query.get(objectId);
    await projet.destroy();
    return true;
  } catch (error) {
    console.error("Error deleting Projet:", error);
    return false;
  }
}
