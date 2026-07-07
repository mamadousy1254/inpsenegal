import type { CmsStatus, ResearchProjectStatus } from "@/lib/constants/cms";

export type SerializedResearchProject = {
  _id: string;
  title: string;
  lead: string;
  year: string;
  projectStatus: ResearchProjectStatus;
  description: string;
  order: number;
  status: CmsStatus;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function serializeResearchProject(doc: {
  _id: { toString(): string };
  title: string;
  lead: string;
  year: string;
  projectStatus: string;
  description: string;
  order?: number;
  status: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}): SerializedResearchProject {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    lead: doc.lead,
    year: doc.year,
    projectStatus: doc.projectStatus as ResearchProjectStatus,
    description: doc.description,
    order: doc.order ?? 0,
    status: doc.status as CmsStatus,
    publishedAt: doc.publishedAt?.toISOString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}
