import { logActivity } from "@/lib/services/audit/log-activity";

type CmsMutationType = "create" | "update" | "delete";

export type CmsActivityActor = {
  id: string;
  email?: string | null;
  firstname: string;
  lastname: string;
};

const VERB_LABELS: Record<CmsMutationType, string> = {
  create: "Ajout",
  update: "Modification",
  delete: "Suppression",
};

/**
 * Journalise une action de gestion de contenu (CMS) dans l'historique
 * d'activité, afin de tracer qui a créé/modifié/supprimé quoi.
 * N'interrompt jamais la requête en cas d'erreur.
 */
export async function logCmsActivity(input: {
  actor: CmsActivityActor;
  actionType: CmsMutationType;
  /** Nom du modèle Mongoose, ex. "Actualite" */
  resource: string;
  /** Libellé lisible de la ressource, ex. "Actualité" */
  resourceLabel: string;
  resourceId?: string;
  /** Titre/nom de l'élément concerné */
  title?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const action = `${input.resource.toLowerCase()}.${input.actionType}`;
    const description = `${VERB_LABELS[input.actionType]} — ${input.resourceLabel}${
      input.title ? ` : ${input.title}` : ""
    }`;

    await logActivity({
      actor: {
        id: input.actor.id,
        email: input.actor.email ?? "",
        firstname: input.actor.firstname,
        lastname: input.actor.lastname,
      },
      action,
      actionType: input.actionType,
      resource: input.resource,
      resourceId: input.resourceId,
      description,
      metadata: {
        ...(input.title ? { title: input.title } : {}),
        ...input.metadata,
      },
    });
  } catch (error) {
    console.error("Erreur journal activité CMS:", error);
  }
}
