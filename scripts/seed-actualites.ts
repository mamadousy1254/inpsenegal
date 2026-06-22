/**
 * Importe les actualités statiques (actualites-data.ts) dans MongoDB.
 *
 * Usage :
 *   npm run seed:actualites
 *   npm run seed:actualites -- --dry-run
 *   npm run seed:actualites -- --force   (met à jour les slugs déjà présents)
 *
 * Prérequis : MONGODB_URL dans .env.local et au moins un utilisateur en base.
 */

import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL manquant (.env.local)");
    process.exit(1);
  }

  const { NEWS } = await import("../components/actualites/actualites-data");
  const { connectDB } = await import("../lib/mongo/db");
  const ActualiteModel = (await import("../lib/mongo/models/actualite.model")).default;
  const UserModel = (await import("../lib/mongo/models/user.model")).default;
  const { markdownActualiteToHtml } = await import("../lib/services/cms/markdown-to-html");

  await connectDB();

  const seedUser =
    (await UserModel.findOne({ role: { $in: ["super_admin", "admin", "rh"] } }).select("_id")) ??
    (await UserModel.findOne().select("_id"));

  if (!seedUser) {
    console.error("❌ Aucun utilisateur trouvé en base. Créez d'abord un compte admin.");
    process.exit(1);
  }

  console.log(`\n📰 Import de ${NEWS.length} actualités statiques`);
  console.log(`   Utilisateur seed : ${seedUser._id.toString()}`);
  if (dryRun) console.log("   Mode : dry-run (aucune écriture)\n");
  if (force) console.log("   Mode : force (mise à jour si slug existant)\n");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of NEWS) {
    const publishedAt = new Date(item.publishedAt);
    if (Number.isNaN(publishedAt.getTime())) {
      console.warn(`⚠️  Date invalide pour « ${item.slug} » — ignoré`);
      skipped += 1;
      continue;
    }

    const payload = {
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      contentHtml: markdownActualiteToHtml(item.content),
      imageUrl: item.image,
      category: item.category,
      author: item.author,
      tags: item.tags,
      isFeatured: item.isFeatured,
      status: "publie" as const,
      publishedAt,
      createdBy: seedUser._id,
    };

    const existing = await ActualiteModel.findOne({ slug: item.slug }).select("_id");

    if (existing && !force) {
      console.log(`⏭️  ${item.slug} — déjà en base (utilisez --force pour mettre à jour)`);
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(
        `${existing ? "🔄" : "➕"} ${item.slug} — ${item.title.slice(0, 50)}… (${item.publishedAt})`,
      );
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      await ActualiteModel.updateOne({ _id: existing._id }, { $set: payload });
      console.log(`🔄 ${item.slug} — mis à jour (${item.publishedAt})`);
      updated += 1;
    } else {
      await ActualiteModel.create(payload);
      console.log(`✅ ${item.slug} — créé (${item.publishedAt})`);
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
  console.error("❌ Erreur seed actualités :", error);
  process.exit(1);
});
