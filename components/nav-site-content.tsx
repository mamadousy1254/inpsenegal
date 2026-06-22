"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  isNavItemActive,
  sidebarActiveItemClass,
  sidebarItemClass,
} from "@/lib/utils/nav";

export function NavSiteContent({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--inp-beige)]/55">
        Contenu site
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.url);
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={active}
                className={cn(sidebarItemClass, active && sidebarActiveItemClass)}
                render={<Link href={item.url} />}
              >
                {item.icon}
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
