/**
 * Importe l'équipe et les délégations de démonstration dans MongoDB.
 * Usage: npm run seed:institut [-- --force]
 */
import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

import { connectDB } from "@/lib/mongo/db";
import InstitutMembreModel from "@/lib/mongo/models/institut-membre.model";
import InstitutDelegationModel from "@/lib/mongo/models/institut-delegation.model";
import UserModel from "@/lib/mongo/models/user.model";
import { demoEquipe } from "@/lib/demoEquipe";
import { demoDelegations } from "@/lib/demoDelegations";

/** Couleurs légende organigramme (carte pédoclimatique INP) */
const ORGANIGRAMME_META: Record<
  string,
  { organigrammeLabel: string; color: string; sortOrder: number }
> = {
  niayes: { organigrammeLabel: "Délégation Niayes", color: "#7A8B2E", sortOrder: 1 },
  "sylvo-pastorale": {
    organigrammeLabel: "Délégation Sylvo Pastorale",
    color: "#E5E5E5",
    sortOrder: 2,
  },
  fleuve: { organigrammeLabel: "Délégation Fleuve", color: "#1E5FD8", sortOrder: 3 },
  "bassin-arachidier": {
    organigrammeLabel: "Délégation Bassin Arachidier",
    color: "#D49A5A",
    sortOrder: 4,
  },
  tamba: { organigrammeLabel: "Délégation Tamba", color: "#E76F6F", sortOrder: 5 },
  kedougou: { organigrammeLabel: "Délégation Kédougou", color: "#F4EA6A", sortOrder: 6 },
  sedhiou: { organigrammeLabel: "Délégation Sédhiou", color: "#63D1C1", sortOrder: 7 },
  ziguinchor: { organigrammeLabel: "Délégation Ziguinchor", color: "#39FF14", sortOrder: 8 },
};

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

  const userId = seedUser._id;
  const existingMembres = await InstitutMembreModel.countDocuments();
  const existingDelegations = await InstitutDelegationModel.countDocuments();

  if ((existingMembres > 0 || existingDelegations > 0) && !force) {
    console.log(
      `${existingMembres} membre(s) et ${existingDelegations} délégation(s) déjà présents. Utilisez --force pour réinitialiser.`,
    );
    await mongoose.disconnect();
    return;
  }

  if (force) {
    await InstitutMembreModel.deleteMany({});
    await InstitutDelegationModel.deleteMany({});
    console.log("Données institut existantes supprimées.");
  }

  for (const [index, membre] of demoEquipe.entries()) {
    await InstitutMembreModel.create({
      slug: membre.id,
      nom: membre.nom,
      fonction: membre.fonction,
      pole: membre.pole,
      zone: membre.zone,
      photo: membre.photo,
      sortOrder: index,
      status: "publie",
      publishedAt: new Date(),
      createdBy: userId,
    });
  }
  console.log(`✓ ${demoEquipe.length} membres importés`);

  for (const delegation of demoDelegations) {
    const meta = ORGANIGRAMME_META[delegation.slug];
    await InstitutDelegationModel.create({
      slug: delegation.slug,
      name: delegation.name,
      shortName: delegation.shortName,
      organigrammeLabel: meta?.organigrammeLabel,
      color: meta?.color ?? delegation.color,
      chefLieu: delegation.chefLieu,
      regionsCouvertes: delegation.regionsCouvertes,
      superficie: delegation.superficie,
      population: delegation.population,
      typesDeSols: delegation.typesDeSols,
      cultureDominantes: delegation.cultureDominantes,
      enjeuxPedologiques: delegation.enjeuxPedologiques,
      missionsSpecifiques: delegation.missionsSpecifiques,
      delegueNom: delegation.delegueNom,
      delegueFonction: delegation.delegueFonction,
      contactAdresse: delegation.contact.adresse,
      contactTelephone: delegation.contact.telephone,
      contactEmail: delegation.contact.email,
      description: delegation.description,
      sortOrder: meta?.sortOrder ?? 0,
      status: "publie",
      publishedAt: new Date(),
      createdBy: userId,
    });
    console.log(`✓ ${delegation.name}`);
  }

  console.log(`\nImport terminé : ${demoEquipe.length} membres, ${demoDelegations.length} délégations.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
