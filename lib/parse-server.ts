import type { Director } from "@/types";

const PARSE_APP_ID = process.env.NEXT_PUBLIC_PARSE_APP_ID ?? "";
const PARSE_JS_KEY = process.env.NEXT_PUBLIC_PARSE_JS_KEY ?? "";
const PARSE_SERVER_URL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL ?? "https://parseapi.back4app.com";

export async function getDirector(): Promise<Director | null> {
  if (!PARSE_APP_ID || !PARSE_JS_KEY) return null;
  try {
    const url = `${PARSE_SERVER_URL}/classes/Director?limit=1&order=-createdAt`;
    const res = await fetch(url, {
      headers: {
        "X-Parse-Application-Id": PARSE_APP_ID,
        "X-Parse-JavaScript-Key": PARSE_JS_KEY,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { results?: Record<string, unknown>[] };
    const row = json.results?.[0];
    if (!row || typeof row.fullName !== "string") return null;
    const photo = row.photo as { url?: string; __type?: string } | undefined;
    const signature = row.signature as { url?: string; __type?: string } | undefined;
    const photoUrl = photo?.url;
    const signatureUrl = signature?.url;
    return {
      objectId: String(row.objectId),
      fullName: String(row.fullName),
      title: String(row.title ?? ""),
      quote: String(row.quote ?? ""),
      message: String(row.message ?? ""),
      photo: photoUrl ? { url: photoUrl } : undefined,
      signature: signatureUrl ? { url: signatureUrl } : undefined,
      createdAt: row.createdAt as string | undefined,
      updatedAt: row.updatedAt as string | undefined,
    };
  } catch {
    return null;
  }
}
