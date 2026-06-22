import mongoose from "mongoose";
import type { DelegationScope } from "@/lib/constants/delegation";
import { connectDB } from "@/lib/mongo/db";
import ValidatorDelegationModel, {
  type IValidatorDelegation,
} from "@/lib/mongo/models/validator-delegation.model";
import UserModel from "@/lib/mongo/models/user.model";
import type {
  DelegationCandidate,
  ValidatorDelegationEntry,
} from "@/lib/types/delegation";

function serializeDelegation(
  doc: IValidatorDelegation | Record<string, unknown>,
): ValidatorDelegationEntry {
  const delegation = doc as IValidatorDelegation;
  return {
    _id: String(delegation._id),
    delegatorUserId: String(delegation.delegatorUserId),
    delegatorFullname: delegation.delegatorFullname,
    delegateUserId: String(delegation.delegateUserId),
    delegateFullname: delegation.delegateFullname,
    scope: delegation.scope,
    startAt: new Date(delegation.startAt).toISOString(),
    endAt: new Date(delegation.endAt).toISOString(),
    status: delegation.status,
    reason: delegation.reason,
    createdAt: delegation.createdAt
      ? new Date(delegation.createdAt).toISOString()
      : undefined,
  };
}

function isWithinWindow(
  delegation: Pick<IValidatorDelegation, "startAt" | "endAt" | "status">,
  at: Date,
): boolean {
  return (
    delegation.status === "active" &&
    delegation.startAt <= at &&
    delegation.endAt >= at
  );
}

export async function getDelegatorIdsForDelegate(
  delegateUserId: string,
  at = new Date(),
): Promise<string[]> {
  await connectDB();

  const rows = await ValidatorDelegationModel.find({
    delegateUserId: new mongoose.Types.ObjectId(delegateUserId),
    status: "active",
    startAt: { $lte: at },
    endAt: { $gte: at },
  })
    .select("delegatorUserId")
    .lean();

  return rows.map((row) => String(row.delegatorUserId));
}

export async function findActiveDelegation(
  delegatorUserId: string,
  delegateUserId: string,
  at = new Date(),
): Promise<IValidatorDelegation | null> {
  await connectDB();

  return ValidatorDelegationModel.findOne({
    delegatorUserId: new mongoose.Types.ObjectId(delegatorUserId),
    delegateUserId: new mongoose.Types.ObjectId(delegateUserId),
    status: "active",
    startAt: { $lte: at },
    endAt: { $gte: at },
  });
}

export async function listDelegationsForUser(userId: string): Promise<{
  given: ValidatorDelegationEntry[];
  received: ValidatorDelegationEntry[];
  actingForDelegatorIds: string[];
}> {
  await connectDB();
  const now = new Date();
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [given, received] = await Promise.all([
    ValidatorDelegationModel.find({
      delegatorUserId: userObjectId,
      status: "active",
      endAt: { $gte: now },
    })
      .sort({ startAt: 1 })
      .lean(),
    ValidatorDelegationModel.find({
      delegateUserId: userObjectId,
      status: "active",
      endAt: { $gte: now },
    })
      .sort({ startAt: 1 })
      .lean(),
  ]);

  const actingForDelegatorIds = received
    .filter((row) => isWithinWindow(row, now))
    .map((row) => String(row.delegatorUserId));

  return {
    given: given.map(serializeDelegation),
    received: received.map(serializeDelegation),
    actingForDelegatorIds,
  };
}

export async function listDelegationCandidates(
  excludeUserId: string,
): Promise<DelegationCandidate[]> {
  await connectDB();

  const users = await UserModel.find({
    _id: { $ne: new mongoose.Types.ObjectId(excludeUserId) },
    isActive: true,
    role: { $ne: "partenaire" },
  })
    .select("firstname lastname email occupation role")
    .sort({ lastname: 1, firstname: 1 })
    .lean();

  return users.map((user) => ({
    _id: String(user._id),
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    occupation: user.occupation,
    role: user.role,
  }));
}

export async function listDelegationTitularCandidates(): Promise<
  DelegationCandidate[]
> {
  await connectDB();

  const users = await UserModel.find({
    isActive: true,
    role: { $ne: "partenaire" },
  })
    .select("firstname lastname email occupation role")
    .sort({ lastname: 1, firstname: 1 })
    .lean();

  return users.map((user) => ({
    _id: String(user._id),
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    occupation: user.occupation,
    role: user.role,
  }));
}

export async function createValidatorDelegation(input: {
  delegatorUserId: string;
  delegateUserId: string;
  startAt: Date;
  endAt: Date;
  reason?: string;
  createdById: string;
  scope?: DelegationScope;
}): Promise<ValidatorDelegationEntry> {
  await connectDB();

  if (input.delegatorUserId === input.delegateUserId) {
    throw new Error("Vous ne pouvez pas vous déléguer à vous-même");
  }

  if (input.endAt <= input.startAt) {
    throw new Error("La date de fin doit être postérieure à la date de début");
  }

  const [delegator, delegate] = await Promise.all([
    UserModel.findById(input.delegatorUserId)
      .select("firstname lastname isActive")
      .lean(),
    UserModel.findById(input.delegateUserId)
      .select("firstname lastname isActive")
      .lean(),
  ]);

  if (!delegator?.isActive) {
    throw new Error("Le délégant est introuvable ou inactif");
  }

  if (!delegate?.isActive) {
    throw new Error("Le délégué est introuvable ou inactif");
  }

  const scope = input.scope ?? "absence_validation";

  const overlap = await ValidatorDelegationModel.findOne({
    delegatorUserId: new mongoose.Types.ObjectId(input.delegatorUserId),
    scope,
    status: "active",
    startAt: { $lt: input.endAt },
    endAt: { $gt: input.startAt },
  }).lean();

  if (overlap) {
    throw new Error(
      "Une délégation active chevauche déjà cette période pour ce titulaire",
    );
  }

  const reverseOverlap = await ValidatorDelegationModel.findOne({
    delegatorUserId: new mongoose.Types.ObjectId(input.delegateUserId),
    delegateUserId: new mongoose.Types.ObjectId(input.delegatorUserId),
    scope,
    status: "active",
    startAt: { $lt: input.endAt },
    endAt: { $gt: input.startAt },
  }).lean();

  if (reverseOverlap) {
    throw new Error(
      "Délégation circulaire interdite : le remplaçant vous a déjà délégué sur cette période",
    );
  }

  const created = await ValidatorDelegationModel.create({
    delegatorUserId: input.delegatorUserId,
    delegatorFullname:
      `${delegator.firstname} ${delegator.lastname}`.trim(),
    delegateUserId: input.delegateUserId,
    delegateFullname: `${delegate.firstname} ${delegate.lastname}`.trim(),
    scope,
    startAt: input.startAt,
    endAt: input.endAt,
    status: "active",
    reason: input.reason?.trim(),
    createdById: input.createdById,
  });

  return serializeDelegation(created);
}

export async function findActiveDelegationForDelegator(
  delegatorUserId: string,
  at = new Date(),
): Promise<IValidatorDelegation | null> {
  await connectDB();

  return ValidatorDelegationModel.findOne({
    delegatorUserId: new mongoose.Types.ObjectId(delegatorUserId),
    status: "active",
    startAt: { $lte: at },
    endAt: { $gte: at },
  });
}

export async function findActiveDelegationsForDelegators(
  delegatorUserIds: string[],
  at = new Date(),
): Promise<Record<string, ValidatorDelegationEntry>> {
  if (delegatorUserIds.length === 0) return {};

  await connectDB();

  const rows = await ValidatorDelegationModel.find({
    delegatorUserId: {
      $in: delegatorUserIds.map((id) => new mongoose.Types.ObjectId(id)),
    },
    status: "active",
    startAt: { $lte: at },
    endAt: { $gte: at },
  })
    .sort({ startAt: -1 })
    .lean();

  const result: Record<string, ValidatorDelegationEntry> = {};

  for (const row of rows) {
    const key = String(row.delegatorUserId);
    if (!result[key]) {
      result[key] = serializeDelegation(row);
    }
  }

  return result;
}

export async function revokeValidatorDelegation(
  delegationId: string,
): Promise<boolean> {
  await connectDB();

  const deleted = await ValidatorDelegationModel.findOneAndDelete({
    _id: delegationId,
    status: "active",
  });

  return Boolean(deleted);
}
