import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site INP.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-primary">
        Mentions légales
      </h1>
      <p className="mt-6 text-muted-foreground">
        Contenu à compléter : éditeur, hébergeur, droits, cookies.
      </p>
    </div>
  );
}
