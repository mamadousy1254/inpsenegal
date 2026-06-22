/**
 * Importe les publications statiques (publication-data.ts) dans MongoDB.
 *
 * Usage :
 *   npm run seed:publications
 *   npm run seed:publications -- --dry-run
 *   npm run seed:publications -- --force
 *
 * La date de publication est dérivée de l'année (31 décembre de l'année indiquée).
 */

import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

/** Date de référence pour le tri : fin d'année de publication */
function publishedAtFromYear(year: number): Date {
  return new Date(Date.UTC(year, 11, 31, 12, 0, 0));
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL manquant (.env.local)");
    process.exit(1);
  }

  const { PUBLICATIONS } = await import("../components/publications/publication-data");
  const { RESEARCH_AXES } = await import("../lib/constants/cms");
  const { connectDB } = await import("../lib/mongo/db");
  const PublicationModel = (await import("../lib/mongo/models/publication.model")).default;
  const UserModel = (await import("../lib/mongo/models/user.model")).default;

  await connectDB();

  const seedUser =
    (await UserModel.findOne({ role: { $in: ["super_admin", "admin", "rh"] } }).select("_id")) ??
    (await UserModel.findOne().select("_id"));

  if (!seedUser) {
    console.error("❌ Aucun utilisateur trouvé en base. Créez d'abord un compte admin.");
    process.exit(1);
  }

  console.log(`\n📚 Import de ${PUBLICATIONS.length} publications statiques`);
  console.log(`   Utilisateur seed : ${seedUser._id.toString()}`);
  if (dryRun) console.log("   Mode : dry-run (aucune écriture)\n");
  if (force) console.log("   Mode : force (mise à jour si slug existant)\n");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of PUBLICATIONS) {
    if (!RESEARCH_AXES.includes(item.researchAxis as (typeof RESEARCH_AXES)[number])) {
      console.warn(`⚠️  Axe invalide pour « ${item.slug} » : ${item.researchAxis}`);
      skipped += 1;
      continue;
    }

    const publishedAt = publishedAtFromYear(item.year);

    const payload = {
      slug: item.slug,
      title: item.title,
      authors: item.authors,
      year: item.year,
      type: item.type,
      abstract: item.abstract,
      tags: item.tags,
      researchAxis: item.researchAxis as (typeof RESEARCH_AXES)[number],
      methodology: item.methodology,
      results: item.results,
      pdfUrl: item.pdfUrl,
      pdfFileName: item.pdfFileName,
      doi: item.doi,
      isFeatured: item.isFeatured,
      showOnScientificPage: true,
      status: "publie" as const,
      publishedAt,
      createdBy: seedUser._id,
    };

    const existing = await PublicationModel.findOne({ slug: item.slug }).select("_id");

    if (existing && !force) {
      console.log(`⏭️  ${item.slug} — déjà en base (utilisez --force pour mettre à jour)`);
      skipped += 1;
      continue;
    }

    const dateLabel = `${item.year} (publié ${publishedAt.toISOString().slice(0, 10)})`;

    if (dryRun) {
      console.log(
        `${existing ? "🔄" : "➕"} ${item.slug} — ${item.title.slice(0, 50)}… (${dateLabel})`,
      );
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      await PublicationModel.updateOne({ _id: existing._id }, { $set: payload });
      console.log(`🔄 ${item.slug} — mis à jour (${dateLabel})`);
      updated += 1;
    } else {
      await PublicationModel.create(payload);
      console.log(`✅ ${item.slug} — créé (${dateLabel})`);
      created += 1;
    }
  }

  console.log("\n--- Résumé ---");
  console.log(`Créées  : ${created}`);
  console.log(`Mises à jour : ${updated}`);
  console.log(`Ignorées : ${skipped}`);
  console.log("");

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("❌ Erreur seed publications :", error);
  process.exit(1);
});
