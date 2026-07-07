/**
 * Importe les vidéos statiques (lib/demoVideos.ts) dans MongoDB (collection CmsVideo).
 *
 * Usage :
 *   npm run seed:videos
 *   npm run seed:videos -- --dry-run
 *   npm run seed:videos -- --force   (met à jour les vidéos déjà présentes)
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

  const { demoVideos } = await import("../lib/demoVideos");
  const { connectDB } = await import("../lib/mongo/db");
  const CmsVideoModel = (await import("../lib/mongo/models/cms-video.model")).default;
  const UserModel = (await import("../lib/mongo/models/user.model")).default;
  const { parseVideoUrl } = await import("../lib/services/cms/video-url");

  await connectDB();

  const seedUser =
    (await UserModel.findOne({ role: { $in: ["super_admin", "admin", "rh"] } }).select("_id")) ??
    (await UserModel.findOne().select("_id"));

  if (!seedUser) {
    console.error("❌ Aucun utilisateur trouvé en base. Créez d'abord un compte admin.");
    process.exit(1);
  }

  console.log(`\n🎬 Import de ${demoVideos.length} vidéos statiques`);
  console.log(`   Utilisateur seed : ${seedUser._id.toString()}`);
  if (dryRun) console.log("   Mode : dry-run (aucune écriture)\n");
  if (force) console.log("   Mode : force (mise à jour si déjà présent)\n");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of demoVideos) {
    const parsedVideo = parseVideoUrl(item.url);
    if (!parsedVideo) {
      console.warn(`⚠️  Lien non reconnu pour « ${item.title} » — ignoré`);
      skipped += 1;
      continue;
    }

    const publishedAt = new Date(item.publishedDate);
    if (Number.isNaN(publishedAt.getTime())) {
      console.warn(`⚠️  Date invalide pour « ${item.title} » — ignoré`);
      skipped += 1;
      continue;
    }

    const payload = {
      title: item.title,
      platform: parsedVideo.platform,
      watchUrl: parsedVideo.watchUrl,
      embedUrl: parsedVideo.embedUrl,
      status: "publie" as const,
      publishedAt,
      createdBy: seedUser._id,
    };

    // Déduplication sur le lien de visionnage
    const existing = await CmsVideoModel.findOne({
      watchUrl: parsedVideo.watchUrl,
    }).select("_id");

    if (existing && !force) {
      console.log(`⏭️  ${item.title.slice(0, 50)}… — déjà en base (--force pour mettre à jour)`);
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(
        `${existing ? "🔄" : "➕"} ${item.title.slice(0, 50)}… (${parsedVideo.platform})`,
      );
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      await CmsVideoModel.updateOne({ _id: existing._id }, { $set: payload });
      console.log(`🔄 ${item.title.slice(0, 50)}… — mis à jour`);
      updated += 1;
    } else {
      await CmsVideoModel.create(payload);
      console.log(`✅ ${item.title.slice(0, 50)}… — créé`);
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
  console.error("❌ Erreur seed vidéos :", error);
  process.exit(1);
});
