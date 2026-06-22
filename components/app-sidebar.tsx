"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavSiteContent } from "@/components/nav-site-content";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  FileTextIcon,
  CalendarIcon,
  CalendarClockIcon,
  HistoryIcon,
  FlaskConicalIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  CircleUserRoundIcon,
  ImageIcon,
  NewspaperIcon,
  BriefcaseIcon,
  Building2Icon,
  HandshakeIcon,
} from "lucide-react";
import { USER_ROLE_LABELS } from "@/lib/permissions/roles";
import type { UserRole } from "@/lib/permissions/roles";
import { canManageSiteContent, canManageUsers, canManageLabRequests } from "@/lib/permissions/can";

const navMain = [
  {
    title: "Absences & congés",
    url: "/dashboard/absences",
    icon: <CalendarIcon />,
  },
  {
    title: "Convocations",
    url: "/dashboard/convocations",
    icon: <CalendarClockIcon />,
  },
];

const navSecondary = [
  {
    title: "Mon espace",
    url: "/dashboard/mon-espace",
    icon: <CircleUserRoundIcon />,
  },
  {
    title: "Paramètres",
    url: "/dashboard",
    icon: <Settings2Icon />,
  },
  {
    title: "Aide",
    url: "/dashboard",
    icon: <CircleHelpIcon />,
  },
  {
    title: "Recherche",
    url: "/dashboard",
    icon: <SearchIcon />,
  },
];

const documents = [
  {
    name: "GED — Documents",
    url: "/dashboard/ged",
    icon: <DatabaseIcon />,
  },
  {
    name: "Rapports",
    url: "/dashboard",
    icon: <FileChartColumnIcon />,
  },
  {
    name: "Archives",
    url: "/dashboard",
    icon: <FileIcon />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = session?.user
    ? {
        name: `${session.user.firstname} ${session.user.lastname}`,
        email: session.user.email ?? "",
        avatar: session.user.avatar,
      }
    : {
        name: "Utilisateur",
        email: "",
        avatar: undefined,
      };

  const role = session?.user?.role as UserRole | undefined;
  const showUsers = role ? canManageUsers(role) : false;
  const showSiteContent = role ? canManageSiteContent(role) : false;
  const showLabRequests = role ? canManageLabRequests(role) : false;

  const siteContentItems = [
    {
      name: "Actualités",
      url: "/dashboard/actualites",
      icon: <NewspaperIcon />,
    },
    {
      name: "Publications",
      url: "/dashboard/publications",
      icon: <FileTextIcon />,
    },
    {
      name: "Publ. scientifiques",
      url: "/dashboard/publications-scientifiques",
      icon: <FlaskConicalIcon />,
    },
    {
      name: "Médiathèque",
      url: "/dashboard/mediatheque",
      icon: <ImageIcon />,
    },
    {
      name: "Documentation",
      url: "/dashboard/documentation",
      icon: <FileTextIcon />,
    },
    {
      name: "Institut",
      url: "/dashboard/institut",
      icon: <Building2Icon />,
    },
    {
      name: "Partenaires",
      url: "/dashboard/partenaires",
      icon: <HandshakeIcon />,
    },
    {
      name: "Recrutement",
      url: "/dashboard/candidature-spontanee",
      icon: <BriefcaseIcon />,
    },
    {
      name: "Rendez-vous",
      url: "/dashboard/rendez-vous",
      icon: <CalendarClockIcon />,
    },
  ];

  const mainItems = [
    ...navMain,
    ...(showLabRequests
      ? [
          {
            title: "Demandes d'analyse",
            url: "/dashboard/demandes-analyse",
            icon: <FlaskConicalIcon />,
          },
        ]
      : []),
    ...(showUsers
      ? [
          {
            title: "Activités",
            url: "/dashboard/activites",
            icon: <HistoryIcon />,
          },
        ]
      : []),
  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="inset"
      className="inp-dashboard-sidebar"
      {...props}
    >
      <SidebarHeader className="border-b border-white/8 px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto gap-3 rounded-xl px-2 py-2.5 hover:bg-white/8 data-active:bg-transparent"
              render={<Link href="/dashboard" />}
            >
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[var(--inp-beige)] to-[#c4a882] text-sm font-bold text-[var(--inp-vert)] shadow-lg shadow-black/25 ring-1 ring-white/20">
                <span className="relative z-10">INP</span>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-white/25 opacity-40"
                />
              </div>
              <div className="min-w-0 flex flex-col gap-1 leading-none">
                <span className="truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground">
                  INP Intranet
                </span>
                {role ? (
                  <span className="inline-flex w-fit max-w-full items-center rounded-md border border-[var(--inp-beige)]/25 bg-[var(--inp-beige)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--inp-beige)]">
                    {USER_ROLE_LABELS[role]}
                  </span>
                ) : (
                  <span className="text-[11px] text-sidebar-foreground/50">
                    Plateforme interne
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0.5 px-2 py-4">
        <NavMain items={mainItems} />
        {showSiteContent && (
          <>
            <SidebarSeparator className="my-3 bg-linear-to-r from-transparent via-white/12 to-transparent" />
            <NavSiteContent items={siteContentItems} />
          </>
        )}
        <SidebarSeparator className="my-3 bg-linear-to-r from-transparent via-white/12 to-transparent" />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto pt-2" />
      </SidebarContent>

      <SidebarFooter className="border-t border-white/8 bg-black/15 p-3 backdrop-blur-sm">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
