import {
  ACTION_LABELS,
  ACTIONS,
  type ActionCode,
  type ActionType,
} from "@/lib/constants/action-types";
import {
  logActivity,
  type ActivityActor,
} from "@/lib/services/audit/log-activity";

export type GedActivityResource = "GedFile" | "GedFolder";

export type GedActivityActor = {
  id: string;
  email?: string | null;
  firstname: string;
  lastname: string;
};

function toActivityActor(actor: GedActivityActor): ActivityActor {
  return {
    id: actor.id,
    email: actor.email ?? "",
    firstname: actor.firstname,
    lastname: actor.lastname,
  };
}

export async function logGedActivity(input: {
  actor: GedActivityActor;
  action: ActionCode;
  actionType: ActionType;
  resource: GedActivityResource;
  resourceId: string;
  description?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await logActivity({
      actor: toActivityActor(input.actor),
      action: input.action,
      actionType: input.actionType,
      resource: input.resource,
      resourceId: input.resourceId,
      description: input.description ?? ACTION_LABELS[input.action],
      metadata: input.metadata,
    });
  } catch (error) {
    console.error(`Erreur journal activité (${input.action}):`, error);
  }
}

export { ACTIONS as GED_ACTIONS };
