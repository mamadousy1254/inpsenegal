import mongoose from "mongoose";
import GedShareModel from "@/lib/mongo/models/ged-share.model";
import { generateGedShareAccessToken } from "@/lib/services/ged/ged-share-token";

export type GedShareRecordInput = {
  itemId: mongoose.Types.ObjectId;
  itemType: "file";
  sharedBy: mongoose.Types.ObjectId;
  sharedWith?: mongoose.Types.ObjectId;
  channel: "email" | "sms";
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  permission: "read";
  expiresAt: Date;
};

export async function persistGedShare(
  shareRecord: GedShareRecordInput,
): Promise<{ accessToken: string; alreadyShared: boolean }> {
  if (shareRecord.sharedWith) {
    const existingShare = await GedShareModel.findOne({
      itemId: shareRecord.itemId,
      sharedWith: shareRecord.sharedWith,
    }).select("_id accessToken");

    const accessToken =
      existingShare?.accessToken ?? generateGedShareAccessToken();

    await GedShareModel.findOneAndUpdate(
      { itemId: shareRecord.itemId, sharedWith: shareRecord.sharedWith },
      { $set: { ...shareRecord, accessToken } },
      { upsert: true },
    );

    return {
      accessToken,
      alreadyShared: !!existingShare,
    };
  }

  const accessToken = generateGedShareAccessToken();
  await GedShareModel.create({
    ...shareRecord,
    accessToken,
  });

  return { accessToken, alreadyShared: false };
}
