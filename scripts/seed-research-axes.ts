/**
 * Importe les axes de recherche statiques dans MongoDB (collection ResearchAxis).
 *
 * Usage :
 *   npm run seed:recherche
 *   npm run seed:recherche -- --dry-run
 *   npm run seed:recherche -- --force   (met à jour les axes déjà présents)
 *
 * Prérequis : MONGODB_URL dans .env.local et au moins un utilisateur en base.
 */

import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";
import type {
  ResearchAxisColor,
  ResearchAxisIcon,
} from "../lib/constants/cms";

loadEnvLocal();

type SeedAxis = {
  title: string;
  description: string;
  stats?: string;
  icon: ResearchAxisIcon;
  color: ResearchAxisColor;
  image: string;
  imageAlt: string;
  order: number;
};

const AXES: SeedAxis[] = [
  {
    title: "Fertilité des sols",
    description:
      "Évaluation et préservation de la fertilité pour des rendements durables. Analyse de la matière organique, du phosphore et de l'azote.",
    stats: "800+ échantillons analysés",
    icon: "sprout",
    color: "amber",
    image: "/recherche/recherche-fertilite-sols.png",
    imageAlt:
      "Prélèvement et analyse de la fertilité d'un échantillon de sol au champ",
    order: 0,
  },
  {
    title: "Dégradation & érosion",
    description:
      "Diagnostic et solutions pour limiter l'érosion et la dégradation des terres. Suivi des zones vulnérables sur le territoire national.",
    stats: "5 régions prioritaires",
    icon: "mountain",
    color: "amber",
    image: "/recherche/recherche-degradation-erosion.png",
    imageAlt:
      "Suivi de terrain dans une zone vulnérable à la dégradation des sols",
    order: 1,
  },
  {
    title: "Salinisation & irrigation",
    description:
      "Gestion de l'eau et des sels pour des systèmes irrigués durables. Étude du delta du fleuve Sénégal et des Niayes.",
    stats: "3 ans de suivi piézométrique",
    icon: "droplets",
    color: "blue",
    image: "/recherche/recherche-salinisation-irrigation.png",
    imageAlt:
      "Prélèvement d'eau pour le suivi de la salinisation en système irrigué",
    order: 2,
  },
  {
    title: "Analyse physico-chimique",
    description:
      "Caractérisation complète des propriétés des sols : granulométrie, pH, conductivité, capacité d'échange cationique.",
    stats: "12 000+ analyses/an",
    icon: "flask",
    color: "violet",
    image: "/recherche/recherche-analyse-physico-chimique.jpg",
    imageAlt: "Laboratoire d'analyses physico-chimiques des sols de l'INP",
    order: 3,
  },
  {
    title: "Modélisation & SIG",
    description:
      "Cartographie numérique prédictive, intégration de données Sentinel-2 et SRTM. Base nationale géoréférencée.",
    stats: "45 000 points de données",
    icon: "chart",
    color: "rose",
    image: "/recherche/recherche-modelisation-sig.png",
    imageAlt:
      "Équipe de l'INP en modélisation et cartographie SIG des sols du Sénégal",
    order: 4,
  },
  {
    title: "Agriculture durable",
    description:
      "Pratiques agroécologiques, gestion intégrée des ressources, restauration des sols dégradés et agroforesterie.",
    stats: "6 projets en cours",
    icon: "leaf",
    color: "amber",
    image: "/recherche/recherche-agriculture-durable.png",
    imageAlt: "Champ-école de l'INP sur les pratiques d'agriculture durable",
    order: 5,
  },
];

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL manquant (.env.local)");
    process.exit(1);
  }

  const { connectDB } = await import("../lib/mongo/db");
  const ResearchAxisModel = (
    await import("../lib/mongo/models/research-axis.model")
  ).default;
  const UserModel = (await import("../lib/mongo/models/user.model")).default;

  await connectDB();

  const seedUser =
    (await UserModel.findOne({
      role: { $in: ["super_admin", "admin", "rh"] },
    }).select("_id")) ?? (await UserModel.findOne().select("_id"));

  if (!seedUser) {
    console.error("❌ Aucun utilisateur trouvé en base. Créez d'abord un compte admin.");
    process.exit(1);
  }

  console.log(`\n🔬 Import de ${AXES.length} axes de recherche`);
  console.log(`   Utilisateur seed : ${seedUser._id.toString()}`);
  if (dryRun) console.log("   Mode : dry-run (aucune écriture)\n");
  if (force) console.log("   Mode : force (mise à jour si déjà présent)\n");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const axis of AXES) {
    const payload = {
      title: axis.title,
      description: axis.description,
      stats: axis.stats,
      icon: axis.icon,
      color: axis.color,
      image: axis.image,
      imageAlt: axis.imageAlt,
      order: axis.order,
      status: "publie" as const,
      publishedAt: new Date(),
      createdBy: seedUser._id,
    };

    // Déduplication sur le titre
    const existing = await ResearchAxisModel.findOne({
      title: axis.title,
    }).select("_id");

    if (existing && !force) {
      console.log(`⏭️  ${axis.title} — déjà en base (--force pour mettre à jour)`);
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`${existing ? "🔄" : "➕"} ${axis.title} (${axis.icon}/${axis.color})`);
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      // On ne réécrit pas publishedAt/createdBy lors d'une mise à jour
      const { publishedAt: _publishedAt, createdBy: _createdBy, ...updateData } =
        payload;
      await ResearchAxisModel.updateOne({ _id: existing._id }, { $set: updateData });
      console.log(`🔄 ${axis.title} — mis à jour`);
      updated += 1;
    } else {
      await ResearchAxisModel.create(payload);
      console.log(`✅ ${axis.title} — créé`);
      created += 1;
    }
  }

  console.log("\n--- Résumé ---");
  console.log(`Créés  : ${created}`);
  console.log(`Mis à jour : ${updated}`);
  console.log(`Ignorés : ${skipped}`);
  console.log("");

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("❌ Erreur seed axes de recherche :", error);
  process.exit(1);
});
