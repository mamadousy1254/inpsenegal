import { logActivity } from "@/lib/services/audit/log-activity";
import type { ActionCode, ActionType } from "@/lib/constants/action-types";
import { ACTION_LABELS } from "@/lib/constants/action-types";

export async function logMissionActivity(input: {
  actor: {
    id: string;
    email?: string | null;
    firstname: string;
    lastname: string;
  };
  action: ActionCode;
  actionType: ActionType;
  resourceId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await logActivity({
      actor: {
        id: input.actor.id,
        email: input.actor.email ?? "",
        firstname: input.actor.firstname,
        lastname: input.actor.lastname,
      },
      action: input.action,
      actionType: input.actionType,
      resource: "Mission",
      resourceId: input.resourceId,
      description: ACTION_LABELS[input.action],
      metadata: input.metadata,
    });
  } catch (error) {
    console.error(`Erreur journal activité (${input.action}):`, error);
  }
}
