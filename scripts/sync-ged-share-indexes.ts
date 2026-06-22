/**
 * Recrée les index GedShare (corrige l'index unique itemId+sharedWith).
 * Usage: npm run sync:ged-share-indexes
 */
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

import { connectDB } from "@/lib/mongo/db";
import GedShareModel from "@/lib/mongo/models/ged-share.model";
import { generateGedShareAccessToken } from "@/lib/services/ged/ged-share-token";

async function backfillAccessTokens() {
  const sharesWithoutToken = await GedShareModel.find({
    $or: [
      { accessToken: { $exists: false } },
      { accessToken: null },
      { accessToken: "" },
    ],
  }).select("_id");

  if (sharesWithoutToken.length === 0) {
    console.log("Aucun partage sans accessToken.");
    return;
  }

  console.log(
    `Mise à jour de ${sharesWithoutToken.length} partage(s) sans accessToken…`,
  );

  for (const share of sharesWithoutToken) {
    await GedShareModel.updateOne(
      { _id: share._id },
      { $set: { accessToken: generateGedShareAccessToken() } },
    );
  }
}

async function main() {
  await connectDB();

  await backfillAccessTokens();

  const collection = GedShareModel.collection;
  const indexes = await collection.indexes();
  const legacyIndex = indexes.find(
    (index) =>
      index.key?.itemId === 1 &&
      index.key?.sharedWith === 1 &&
      index.sparse === true,
  );

  if (legacyIndex?.name) {
    console.log(`Suppression de l'index obsolète : ${legacyIndex.name}`);
    await collection.dropIndex(legacyIndex.name);
  }

  await GedShareModel.syncIndexes();
  console.log("Index GedShare synchronisés.");

  const updated = await collection.indexes();
  console.log(
    updated
      .filter((index) => index.name !== "_id_")
      .map((index) => `${index.name}: ${JSON.stringify(index.key)}`)
      .join("\n"),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
