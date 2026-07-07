export const NEWSLETTER_STATUSES = ["actif", "desinscrit"] as const;
export type NewsletterStatus = (typeof NEWSLETTER_STATUSES)[number];

export const NEWSLETTER_STATUS_LABELS: Record<NewsletterStatus, string> = {
  actif: "Actif",
  desinscrit: "Désinscrit",
};

export const NEWSLETTER_SOURCES = ["footer", "article", "autre"] as const;
export type NewsletterSource = (typeof NEWSLETTER_SOURCES)[number];

export const NEWSLETTER_SOURCE_LABELS: Record<NewsletterSource, string> = {
  footer: "Pied de page",
  article: "Article",
  autre: "Autre",
};
