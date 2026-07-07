import Link from "next/link";
import { demoDelegations } from "@/lib/demoDelegations";

/* ------------------------------------------------------------------ */
/*  Panneau latéral « Autres délégations »                             */
/*                                                                     */
/*  Liste les 8 délégations pour naviguer de l'une à l'autre sans      */
/*  repasser par l'organigramme. La délégation courante est mise en    */
/*  évidence (« Vous êtes ici », non cliquable).                       */
/*                                                                     */
/*  Les points de couleur reprennent la LÉGENDE de la carte            */
/*  pédologique (couleurs de données — y compris les verts — à         */
/*  conserver telles quelles). Le reste suit la charte ocre/brun.      */
/* ------------------------------------------------------------------ */

export function DelegationsSidePanel({ currentSlug }: { currentSlug: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5DCC2] bg-white shadow-sm">
      <div className="border-b border-[#E5DCC2] bg-[#FBF7EF] px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#7B4F2A]">
          Autres délégations
        </h2>
      </div>

      <ul className="p-2">
        {demoDelegations.map((d) => {
          const isCurrent = d.slug === currentSlug;
          const colorBar = (
            <span
              className="h-9 w-1.5 flex-shrink-0 rounded-full ring-1 ring-black/5"
              style={{ backgroundColor: d.color }}
              aria-hidden
            />
          );

          return (
            <li key={d.slug}>
              {isCurrent ? (
                <div
                  aria-current="page"
                  className="flex items-center gap-3 rounded-xl bg-[#F8F1E0] px-3 py-2.5"
                >
                  {colorBar}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold text-[#2A1F18]">
                      {d.shortName}
                    </span>
                    <span className="block text-xs font-semibold text-[#7B4F2A]">
                      Vous êtes ici
                    </span>
                  </span>
                </div>
              ) : (
                <Link
                  href={`/institut/delegations/${d.slug}`}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F8F1E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4F2A] focus-visible:ring-offset-1"
                >
                  {colorBar}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-[#2A1F18] transition-colors group-hover:text-[#7B4F2A]">
                      {d.shortName}
                    </span>
                    <span className="block text-xs text-[#8B7355]">
                      {d.chefLieu}
                    </span>
                  </span>
                  <span
                    className="flex-shrink-0 text-[#C9A574] transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="border-t border-[#E5DCC2] px-5 py-4">
        <Link
          href="/institut/organigramme"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#7B4F2A] transition-colors hover:text-[#4A2F1A]"
        >
          Voir l&apos;organigramme complet
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
