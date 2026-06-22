export function isNavItemActive(pathname: string, url: string): boolean {
  // Les entrées qui pointent vers /dashboard sans page dédiée ne doivent
  // pas se surligner : seul le bouton « Tableau de bord » gère ce cas.
  if (url === "/dashboard") {
    return false;
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

export const sidebarItemClass =
  "rounded-lg text-sidebar-foreground/70 transition-all duration-200 hover:bg-white/8 hover:text-sidebar-foreground [&_svg]:text-sidebar-foreground/50 hover:[&_svg]:text-[var(--inp-beige)]";

export const sidebarActiveItemClass =
  "relative bg-linear-to-r from-white/12 to-white/5 font-semibold text-[var(--inp-beige)] shadow-[inset_3px_0_0_0_var(--inp-beige)] hover:bg-white/12 hover:text-[var(--inp-beige)] data-active:bg-white/10 data-active:text-[var(--inp-beige)] [&_svg]:text-[var(--inp-beige)] hover:[&_svg]:text-[var(--inp-beige)]";
