/**
 * Importe les projets de recherche statiques dans MongoDB (collection ResearchProject).
 *
 * Usage :
 *   npm run seed:projets
 *   npm run seed:projets -- --dry-run
 *   npm run seed:projets -- --force   (met à jour les projets déjà présents)
 *
 * Prérequis : MONGODB_URL dans .env.local et au moins un utilisateur en base.
 */

import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";
import type { ResearchProjectStatus } from "../lib/constants/cms";

loadEnvLocal();

type SeedProject = {
  title: string;
  lead: string;
  year: string;
  projectStatus: ResearchProjectStatus;
  description: string;
  order: number;
};

const PROJECTS: SeedProject[] = [
  {
    title: "Cartographie numérique des sols de la Casamance",
    lead: "Dr. Amadou Diallo",
    year: "2024 – 2026",
    projectStatus: "en_cours",
    description:
      "Réalisation d'une carte pédologique à l'échelle 1/50 000 de la région de la Casamance, intégrant télédétection et relevés de terrain.",
    order: 0,
  },
  {
    title: "Impact du changement climatique sur la salinisation des sols",
    lead: "Dr. Fatou Sow",
    year: "2023 – 2025",
    projectStatus: "en_cours",
    description:
      "Évaluation de l'évolution de la salinisation dans le bassin arachidier et les Niayes, et proposition de mesures d'adaptation.",
    order: 1,
  },
  {
    title: "Référentiel national de fertilité des sols",
    lead: "Pr. Moussa Ndiaye",
    year: "2022 – 2024",
    projectStatus: "termine",
    description:
      "Élaboration d'un référentiel national de fertilité basé sur l'analyse de plus de 5 000 échantillons couvrant les 14 régions.",
    order: 2,
  },
  {
    title: "SIG participatif pour l'agriculture familiale",
    lead: "Dr. Ibrahima Fall",
    year: "2024 – 2027",
    projectStatus: "partenariat",
    description:
      "Développement d'une plateforme SIG collaborative avec la FAO pour appuyer les exploitations familiales dans la gestion de la fertilité.",
    order: 3,
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
  const ResearchProjectModel = (
    await import("../lib/mongo/models/research-project.model")
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

  console.log(`\n📁 Import de ${PROJECTS.length} projets de recherche`);
  console.log(`   Utilisateur seed : ${seedUser._id.toString()}`);
  if (dryRun) console.log("   Mode : dry-run (aucune écriture)\n");
  if (force) console.log("   Mode : force (mise à jour si déjà présent)\n");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const project of PROJECTS) {
    const payload = {
      title: project.title,
      lead: project.lead,
      year: project.year,
      projectStatus: project.projectStatus,
      description: project.description,
      order: project.order,
      status: "publie" as const,
      publishedAt: new Date(),
      createdBy: seedUser._id,
    };

    const existing = await ResearchProjectModel.findOne({
      title: project.title,
    }).select("_id");

    if (existing && !force) {
      console.log(`⏭️  ${project.title} — déjà en base (--force pour mettre à jour)`);
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`${existing ? "🔄" : "➕"} ${project.title} (${project.projectStatus})`);
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      const { publishedAt: _publishedAt, createdBy: _createdBy, ...updateData } =
        payload;
      await ResearchProjectModel.updateOne({ _id: existing._id }, { $set: updateData });
      console.log(`🔄 ${project.title} — mis à jour`);
      updated += 1;
    } else {
      await ResearchProjectModel.create(payload);
      console.log(`✅ ${project.title} — créé`);
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
  console.error("❌ Erreur seed projets de recherche :", error);
  process.exit(1);
});
