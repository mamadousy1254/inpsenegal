import { headers } from "next/headers";
import ActivityHistoryModel from "@/lib/mongo/models/activity-history.model";
import type { ActionType } from "@/lib/constants/action-types";

export type ActivityActor = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
};

export type LogActivityInput = {
  actor: ActivityActor;
  action: string;
  actionType: ActionType;
  resource: string;
  resourceId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
};

async function getRequestMetaFromHeaders() {
  const headerList = await headers();
  return {
    ip:
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerList.get("x-real-ip") ||
      undefined,
    userAgent: headerList.get("user-agent") || undefined,
  };
}

export async function logActivity(input: LogActivityInput): Promise<void> {
  const meta =
    input.ip !== undefined || input.userAgent !== undefined
      ? { ip: input.ip, userAgent: input.userAgent }
      : await getRequestMetaFromHeaders();

  await ActivityHistoryModel.create({
    actorId: input.actor.id,
    actorEmail: input.actor.email,
    actorFirstname: input.actor.firstname,
    actorLastname: input.actor.lastname,
    action: input.action,
    actionType: input.actionType,
    resource: input.resource,
    resourceId: input.resourceId,
    description: input.description,
    metadata: input.metadata,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
}
