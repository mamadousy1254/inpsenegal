/**
 * Importe les partenaires de démonstration dans MongoDB.
 * Usage: npm run seed:partenaires [-- --force]
 */
import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

import { connectDB } from "@/lib/mongo/db";
import PartenaireModel from "@/lib/mongo/models/partenaire.model";
import UserModel from "@/lib/mongo/models/user.model";
import { demoPartenaires } from "@/lib/demoPartenaires";

async function main() {
  const force = process.argv.includes("--force");
  await connectDB();

  const seedUser =
    (await UserModel.findOne({ role: { $in: ["super_admin", "admin", "rh"] } }).select("_id")) ??
    (await UserModel.findOne().select("_id"));

  if (!seedUser) {
    console.error("❌ Aucun utilisateur trouvé. Créez d'abord un compte admin.");
    process.exit(1);
  }

  const existing = await PartenaireModel.countDocuments();
  if (existing > 0 && !force) {
    console.log(`${existing} partenaire(s) déjà présents. Utilisez --force pour réinitialiser.`);
    await mongoose.disconnect();
    return;
  }

  if (force) {
    await PartenaireModel.deleteMany({});
    console.log("Partenaires existants supprimés.");
  }

  for (const [index, p] of demoPartenaires.entries()) {
    await PartenaireModel.create({
      slug: p.id,
      nom: p.nom,
      acronyme: p.acronyme,
      description: p.description,
      category: p.category,
      logo: p.logo,
      siteWeb: p.siteWeb,
      pays: p.pays,
      sortOrder: index,
      status: "publie",
      publishedAt: new Date(),
      createdBy: seedUser._id,
    });
    console.log(`✓ ${p.acronyme}`);
  }

  console.log(`\n${demoPartenaires.length} partenaire(s) importé(s).`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
