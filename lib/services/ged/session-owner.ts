import mongoose from "mongoose";
import type { Session } from "next-auth";
import type { IGedOwnerSnapshot } from "@/lib/mongo/models/ged-folder.model";

export function buildGedOwnerFromSession(session: Session): IGedOwnerSnapshot {
  return {
    _id: new mongoose.Types.ObjectId(session.user.id),
    name: `${session.user.firstname ?? ""} ${session.user.lastname ?? ""}`.trim(),
    avatar: session.user.avatar,
  };
}
