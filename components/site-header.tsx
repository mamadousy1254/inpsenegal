"use client";

import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { USER_ROLE_LABELS } from "@/lib/permissions/roles";
import type { UserRole } from "@/lib/permissions/roles";

export function SiteHeader({ title = "Tableau de bord" }: { title?: string }) {
  const { data: session } = useSession();
  const role = session?.user?.role as UserRole | undefined;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 bg-[var(--inp-vert)] text-white hover:bg-[var(--inp-vert)]/90 hover:text-white" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <div className="flex flex-col">
          <h1 className="text-base font-medium">{title}</h1>
          {session?.user && (
            <p className="text-xs text-muted-foreground">
              {session.user.firstname} {session.user.lastname}
              {role ? ` — ${USER_ROLE_LABELS[role]}` : ""}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
