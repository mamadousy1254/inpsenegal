/**
 * Importe les images statiques de la médiathèque dans MongoDB.
 *
 * Usage :
 *   npm run seed:mediatheque
 *   npm run seed:mediatheque -- --dry-run
 *   npm run seed:mediatheque -- --force
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

  const {
    MEDIATHEQUE_GALLERY,
    localMediathequePublicId,
    publishedAtForMediathequeOrder,
  } = await import("../components/mediatheque/mediatheque-data");
  const { connectDB } = await import("../lib/mongo/db");
  const MediathequeItemModel = (await import("../lib/mongo/models/mediatheque-item.model")).default;
  const UserModel = (await import("../lib/mongo/models/user.model")).default;

  await connectDB();

  const seedUser =
    (await UserModel.findOne({ role: { $in: ["super_admin", "admin", "rh"] } }).select("_id")) ??
    (await UserModel.findOne().select("_id"));

  if (!seedUser) {
    console.error("❌ Aucun utilisateur trouvé en base. Créez d'abord un compte admin.");
    process.exit(1);
  }

  console.log(`\n🖼️  Import de ${MEDIATHEQUE_GALLERY.length} images médiathèque`);
  console.log(`   Utilisateur seed : ${seedUser._id.toString()}`);
  if (dryRun) console.log("   Mode : dry-run (aucune écriture)\n");
  if (force) console.log("   Mode : force (mise à jour si image existante)\n");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of MEDIATHEQUE_GALLERY) {
    const imagePublicId = localMediathequePublicId(item.src);
    const publishedAt = publishedAtForMediathequeOrder(item.order);

    const payload = {
      imageUrl: item.src,
      imagePublicId,
      alt: item.alt,
      caption: item.caption,
      status: "publie" as const,
      publishedAt,
      createdBy: seedUser._id,
    };

    const existing = await MediathequeItemModel.findOne({
      $or: [{ imagePublicId }, { imageUrl: item.src }],
    }).select("_id");

    if (existing && !force) {
      console.log(`⏭️  ${imagePublicId} — déjà en base (utilisez --force pour mettre à jour)`);
      skipped += 1;
      continue;
    }

    const dateLabel = publishedAt.toISOString().slice(0, 10);

    if (dryRun) {
      console.log(
        `${existing ? "🔄" : "➕"} #${item.order} ${item.caption.slice(0, 45)}… (${dateLabel})`,
      );
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      await MediathequeItemModel.updateOne({ _id: existing._id }, { $set: payload });
      console.log(`🔄 #${item.order} — mis à jour (${dateLabel})`);
      updated += 1;
    } else {
      await MediathequeItemModel.create(payload);
      console.log(`✅ #${item.order} — créé (${dateLabel})`);
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
  console.error("❌ Erreur seed médiathèque :", error);
  process.exit(1);
});
