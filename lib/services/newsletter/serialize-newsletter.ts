import type { INewsletterSubscriber } from "@/lib/mongo/models/newsletter.model";
import type { NewsletterSource, NewsletterStatus } from "@/lib/constants/newsletter";

export type SerializedNewsletterSubscriber = {
  _id: string;
  email: string;
  status: NewsletterStatus;
  source: NewsletterSource;
  ip?: string;
  userAgent?: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeNewsletterSubscriber(
  doc: INewsletterSubscriber | Record<string, unknown>,
): SerializedNewsletterSubscriber {
  const d = doc as INewsletterSubscriber;
  return {
    _id: d._id.toString(),
    email: d.email,
    status: d.status,
    source: d.source,
    ip: d.ip,
    userAgent: d.userAgent,
    unsubscribedAt: d.unsubscribedAt?.toISOString(),
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}
