/**
 * Importe les ressources documentation statiques dans MongoDB.
 *
 * Usage :
 *   npm run seed:documentation
 *   npm run seed:documentation -- --dry-run
 *   npm run seed:documentation -- --force
 */

import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

function publishedAtFromYear(year: number): Date {
  return new Date(Date.UTC(year, 11, 31, 12, 0, 0));
}

function slugFromTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const SEED_ITEMS = [
  // rapports-publications
  {
    rubrique: "rapports-publications" as const,
    title: "Rapport national sur la fertilité des sols",
    year: 2023,
    docType: "Rapport technique" as const,
    description:
      "Analyse complète des paramètres physico-chimiques des sols agricoles du Sénégal.",
  },
  {
    rubrique: "rapports-publications" as const,
    title: "Cartographie pédologique du bassin arachidier",
    year: 2022,
    docType: "Publication scientifique" as const,
    description:
      "Étude détaillée de la variabilité spatiale des sols du bassin arachidier.",
  },
  {
    rubrique: "rapports-publications" as const,
    title: "Guide méthodologique d'échantillonnage des sols",
    year: 2021,
    docType: "Guide technique" as const,
    description:
      "Procédures normalisées pour la collecte et l'analyse des échantillons de sol.",
  },
  {
    rubrique: "rapports-publications" as const,
    title: "Atlas pédologique de la Casamance",
    year: 2023,
    docType: "Publication scientifique" as const,
    description:
      "Cartographie exhaustive des unités pédologiques de la région de Casamance.",
  },
  {
    rubrique: "rapports-publications" as const,
    title: "Évaluation de la dégradation des terres au Sénégal",
    year: 2020,
    docType: "Rapport technique" as const,
    description:
      "Diagnostic national de l'état de dégradation des terres et recommandations stratégiques.",
  },
  {
    rubrique: "rapports-publications" as const,
    title: "Manuel de bonnes pratiques de gestion durable des terres",
    year: 2022,
    docType: "Guide technique" as const,
    description: "Référentiel technique destiné aux acteurs locaux et agents de terrain.",
  },
  // guides-techniques
  {
    rubrique: "guides-techniques" as const,
    title: "Guide méthodologique d'échantillonnage des sols",
    year: 2023,
    category: "Terrain",
    description:
      "Procédures normalisées pour la collecte, la conservation et le transport des échantillons de sols.",
  },
  {
    rubrique: "guides-techniques" as const,
    title: "Guide d'analyse physico-chimique en laboratoire",
    year: 2022,
    category: "Laboratoire",
    description:
      "Normes et protocoles d'analyses des paramètres chimiques et physiques des sols.",
  },
  {
    rubrique: "guides-techniques" as const,
    title: "Guide de cartographie pédologique",
    year: 2021,
    category: "Cartographie",
    description: "Méthodologie de production des cartes pédologiques et interprétation spatiale.",
  },
  {
    rubrique: "guides-techniques" as const,
    title: "Guide de restauration des sols dégradés",
    year: 2023,
    category: "Terrain",
    description:
      "Techniques et approches éprouvées pour la réhabilitation des sols affectés par l'érosion et la salinisation.",
  },
  {
    rubrique: "guides-techniques" as const,
    title: "Protocole d'analyse microbiologique des sols",
    year: 2021,
    category: "Laboratoire",
    description:
      "Méthodes normalisées d'évaluation de l'activité biologique et de la biodiversité des sols.",
  },
  {
    rubrique: "guides-techniques" as const,
    title: "Guide d'utilisation du SIG pour la pédologie",
    year: 2022,
    category: "Cartographie",
    description:
      "Manuel pratique pour l'exploitation des systèmes d'information géographique en science des sols.",
  },
  // bulletins-scientifiques
  {
    rubrique: "bulletins-scientifiques" as const,
    title: "Bulletin Scientifique INP – Vol. 12",
    issue: "N°12",
    year: 2023,
    description:
      "Études approfondies sur la fertilité des sols et l'évaluation agro-pédologique nationale.",
  },
  {
    rubrique: "bulletins-scientifiques" as const,
    title: "Bulletin Scientifique INP – Vol. 11",
    issue: "N°11",
    year: 2022,
    description: "Cartographie pédologique avancée et analyses comparatives régionales.",
  },
  {
    rubrique: "bulletins-scientifiques" as const,
    title: "Bulletin Scientifique INP – Vol. 10",
    issue: "N°10",
    year: 2021,
    description: "Innovations méthodologiques en gestion durable des terres.",
  },
  {
    rubrique: "bulletins-scientifiques" as const,
    title: "Bulletin Scientifique INP – Vol. 9",
    issue: "N°9",
    year: 2020,
    description:
      "Impact du changement climatique sur les propriétés physico-chimiques des sols sahéliens.",
  },
  {
    rubrique: "bulletins-scientifiques" as const,
    title: "Bulletin Scientifique INP – Vol. 8",
    issue: "N°8",
    year: 2019,
    description:
      "Techniques de restauration des sols dégradés dans le bassin arachidier.",
  },
  {
    rubrique: "bulletins-scientifiques" as const,
    title: "Bulletin Scientifique INP – Vol. 7",
    issue: "N°7",
    year: 2018,
    description:
      "Évaluation de la biodiversité des sols et indicateurs biologiques de qualité.",
  },
  // open-data
  {
    rubrique: "open-data" as const,
    title: "Cartographie pédologique nationale",
    category: "Cartographie",
    format: "GeoJSON" as const,
    year: 2024,
    description:
      "Données géospatiales des unités pédologiques couvrant le territoire national.",
  },
  {
    rubrique: "open-data" as const,
    title: "Analyse physico-chimique des sols agricoles",
    category: "Laboratoire",
    format: "CSV" as const,
    year: 2023,
    description:
      "Base de données des paramètres chimiques et physiques analysés en laboratoire.",
  },
  {
    rubrique: "open-data" as const,
    title: "Zones pédoclimatiques du Sénégal",
    category: "Cartographie",
    format: "XLS" as const,
    year: 2022,
    description: "Classification des zones pédoclimatiques avec indicateurs agronomiques.",
  },
  {
    rubrique: "open-data" as const,
    title: "Inventaire des sols dégradés — Bassin arachidier",
    category: "Terrain",
    format: "CSV" as const,
    year: 2023,
    description:
      "Données d'inventaire terrain de la dégradation des sols dans les régions du bassin arachidier.",
  },
  {
    rubrique: "open-data" as const,
    title: "Points d'échantillonnage — Réseau national",
    category: "Terrain",
    format: "GeoJSON" as const,
    year: 2024,
    description:
      "Coordonnées GPS et métadonnées des stations du réseau national de suivi pédologique.",
  },
  {
    rubrique: "open-data" as const,
    title: "Résultats d'analyses — Campagne 2023",
    category: "Laboratoire",
    format: "XLS" as const,
    year: 2023,
    description: "Résultats complets des analyses de laboratoire de la campagne annuelle 2023.",
  },
  // archives
  {
    rubrique: "archives" as const,
    title: "Rapport pédologique national",
    year: 2018,
    docType: "Rapport technique" as const,
    description:
      "Analyse nationale des caractéristiques physico-chimiques des sols.",
  },
  {
    rubrique: "archives" as const,
    title: "Étude des sols du Sénégal oriental",
    year: 2016,
    docType: "Publication scientifique" as const,
    description:
      "Cartographie détaillée et évaluation de la fertilité régionale.",
  },
  {
    rubrique: "archives" as const,
    title: "Bulletin technique INP — 2015",
    year: 2015,
    docType: "Bulletin" as const,
    description:
      "Compilation des travaux scientifiques publiés durant l'année 2015.",
  },
  {
    rubrique: "archives" as const,
    title: "Inventaire des ressources en sols — Zone sylvo-pastorale",
    year: 2017,
    docType: "Rapport technique" as const,
    description:
      "Évaluation des potentialités pédologiques de la zone sylvo-pastorale du Nord.",
  },
  {
    rubrique: "archives" as const,
    title: "Étude de salinisation des sols du Delta",
    year: 2014,
    docType: "Publication scientifique" as const,
    description:
      "Diagnostic de la salinisation dans la vallée du fleuve Sénégal et options de remédiation.",
  },
  {
    rubrique: "archives" as const,
    title: "Bulletin technique INP — 2013",
    year: 2013,
    docType: "Bulletin" as const,
    description:
      "Synthèse annuelle des activités de recherche et de terrain de l'INP.",
  },
  // textes-reglementaires
  {
    rubrique: "textes-reglementaires" as const,
    slug: "decret-2004-802-creation-inp",
    title: "Décret n°2004-802 du 28 juin 2004",
    year: 2004,
    category: "base-legale",
    legalType: "Décret" as const,
    legalDate: "28 juin 2004",
    reference: "Journal Officiel du Sénégal",
    fileSize: "0.86 MB",
    description:
      "Création de l'Institut National de Pédologie en tant qu'établissement public scientifique.",
  },
  {
    rubrique: "textes-reglementaires" as const,
    slug: "loi-orientation-agro-sylvo-pastorale",
    title: "Loi d'orientation agro-sylvo-pastorale",
    year: 2004,
    category: "base-legale",
    legalType: "Loi" as const,
    legalDate: "4 juin 2004",
    reference: "Assemblée Nationale du Sénégal",
    fileSize: "1.2 MB",
    description:
      "Cadre stratégique définissant la politique nationale agricole et la gestion durable des terres.",
  },
  {
    rubrique: "textes-reglementaires" as const,
    slug: "politique-nationale-gestion-durable-terres",
    title: "Politique nationale de gestion durable des terres",
    year: 2019,
    category: "national",
    legalType: "Document de politique" as const,
    legalDate: "Mars 2019",
    reference: "Ministère de l'Agriculture",
    fileSize: "2.4 MB",
    description:
      "Orientation stratégique pour lutter contre la dégradation des terres et promouvoir la résilience agricole.",
  },
  {
    rubrique: "textes-reglementaires" as const,
    slug: "code-environnement-senegal",
    title: "Code de l'environnement",
    year: 2001,
    category: "national",
    legalType: "Loi" as const,
    legalDate: "Janvier 2001",
    reference: "Journal Officiel du Sénégal",
    fileSize: "3.1 MB",
    description:
      "Dispositions réglementaires relatives à la protection des ressources naturelles.",
  },
  {
    rubrique: "textes-reglementaires" as const,
    slug: "convention-nations-unies-desertification",
    title:
      "Convention des Nations Unies sur la lutte contre la désertification (CNULCD)",
    year: 1994,
    category: "international",
    legalType: "Convention internationale" as const,
    legalDate: "17 juin 1994",
    reference: "Nations Unies",
    fileSize: "1.8 MB",
    description:
      "Instrument juridique international clé pour la protection des terres arides et semi-arides.",
  },
  {
    rubrique: "textes-reglementaires" as const,
    slug: "convention-diversite-biologique",
    title: "Convention sur la diversité biologique",
    year: 1992,
    category: "international",
    legalType: "Convention internationale" as const,
    legalDate: "5 juin 1992",
    reference: "Nations Unies",
    fileSize: "2.1 MB",
    description:
      "Cadre mondial pour la conservation et l'utilisation durable de la biodiversité des sols.",
  },
  {
    rubrique: "textes-reglementaires" as const,
    slug: "accord-paris-climat",
    title: "Accord de Paris sur le climat",
    year: 2015,
    category: "international",
    legalType: "Accord international" as const,
    legalDate: "12 décembre 2015",
    reference: "CCNUCC",
    fileSize: "0.95 MB",
    description:
      "Engagement international pour la réduction des émissions et l'adaptation au changement climatique.",
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
  const DocumentationResourceModel = (
    await import("../lib/mongo/models/documentation-resource.model")
  ).default;
  const UserModel = (await import("../lib/mongo/models/user.model")).default;

  await connectDB();

  const migrated = await DocumentationResourceModel.updateMany(
    { rubrique: "documentation" },
    { $set: { rubrique: "rapports-publications" } },
  );
  if (migrated.modifiedCount > 0) {
    console.log(
      `↪ ${migrated.modifiedCount} entrée(s) migrée(s) : documentation → rapports-publications\n`,
    );
  }

  const seedUser =
    (await UserModel.findOne({ role: { $in: ["super_admin", "admin", "rh"] } }).select("_id")) ??
    (await UserModel.findOne().select("_id"));

  if (!seedUser) {
    console.error("❌ Aucun utilisateur trouvé en base.");
    process.exit(1);
  }

  console.log(`\n📄 Import de ${SEED_ITEMS.length} ressources documentation`);
  if (dryRun) console.log("   Mode : dry-run\n");
  if (force) console.log("   Mode : force\n");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of SEED_ITEMS) {
    const slug =
      "slug" in item && item.slug ? item.slug : slugFromTitle(item.title);
    const publishedAt = publishedAtFromYear(item.year);

    const payload = {
      ...item,
      slug,
      status: "publie" as const,
      publishedAt,
      createdBy: seedUser._id,
    };

    const existing = await DocumentationResourceModel.findOne({
      rubrique: item.rubrique,
      slug,
    }).select("_id");

    if (existing && !force) {
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`${existing ? "🔄" : "➕"} [${item.rubrique}] ${slug}`);
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing) {
      await DocumentationResourceModel.updateOne({ _id: existing._id }, { $set: payload });
      updated += 1;
    } else {
      await DocumentationResourceModel.create(payload);
      created += 1;
    }
  }

  console.log("\n--- Résumé ---");
  console.log(`Créées : ${created}`);
  console.log(`Mises à jour : ${updated}`);
  console.log(`Ignorées : ${skipped}\n`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("❌ Erreur seed documentation :", error);
  process.exit(1);
});
