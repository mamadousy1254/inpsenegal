import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import {
  OrganigrammeAncrage,
  type OrganigrammeDelegationLink,
} from "@/components/institut/OrganigrammeAncrage";
import { getPublishedInstitutDelegations } from "@/lib/services/institut/get-published-institut";

export const metadata: Metadata = {
  title: "Organigramme et ancrage territorial",
  description:
    "Structure organisationnelle de l'INP et carte des délégations pédoclimatiques : Conseil d'Administration, Direction Générale, Direction Technique, ancrage national.",
};

async function loadOrganigrammeDelegations(): Promise<OrganigrammeDelegationLink[] | undefined> {
  try {
    const items = await getPublishedInstitutDelegations();
    if (items.length === 0) return undefined;
    return items.map((d) => ({
      slug: d.slug,
      label: d.organigrammeLabel,
      color: d.color,
    }));
  } catch {
    return undefined;
  }
}

export default async function OrganigrammePage() {
  const delegations = await loadOrganigrammeDelegations();

  return (
    <>
      <PageHero
        label="L'Institut"
        title="Organigramme et ancrage territorial"
        subtitle="Structure hiérarchique et délégations pédoclimatiques de l'INP."
      />
      <OrganigrammeAncrage delegations={delegations} />

      {/* Renvoi vers le cadre juridique */}
      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/institut/cadre-juridique"
            className="group flex items-center gap-4 rounded-2xl border border-[#E5DCC2] bg-[#F8F1E0]/60 p-5 transition-all hover:border-[#C9A574] hover:shadow-sm"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#7B4F2A]">
              <ScrollText className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex-1 text-sm text-[#5A4733]">
              L&apos;organisation de l&apos;INP est définie par le{" "}
              <span className="font-semibold text-[#7B4F2A]">décret de création</span>.
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#7B4F2A] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
