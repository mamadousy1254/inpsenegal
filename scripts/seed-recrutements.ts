/**
 * Importe les offres de démonstration dans MongoDB.
 * Usage: npm run seed:recrutements [-- --force]
 */
import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

import { connectDB } from "@/lib/mongo/db";
import RecrutementModel from "@/lib/mongo/models/recrutement.model";
import { demoRecrutements } from "@/lib/demoRecrutements";

async function main() {
  const force = process.argv.includes("--force");
  await connectDB();

  const existing = await RecrutementModel.countDocuments();
  if (existing > 0 && !force) {
    console.log(`${existing} offre(s) déjà présentes. Utilisez --force pour réinitialiser.`);
    await mongoose.disconnect();
    return;
  }

  if (force) {
    await RecrutementModel.deleteMany({});
    console.log("Offres existantes supprimées.");
  }

  for (const item of demoRecrutements) {
    await RecrutementModel.create({
      slug: item.slug,
      type: item.type,
      title: item.title.replace("[Exemple] ", ""),
      shortDescription: item.shortDescription,
      location: item.location,
      contractType: item.contractType,
      publishedAt: new Date(),
      deadlineLabel: item.deadline,
      offerStatus: item.status === "ouvert" ? "ouvert" : "ferme",
      emailContact: item.emailContact,
      references: item.references,
      status: "publie",
    });
    console.log(`✓ ${item.references} — ${item.title}`);
  }

  console.log(`\n${demoRecrutements.length} offre(s) importée(s).`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
