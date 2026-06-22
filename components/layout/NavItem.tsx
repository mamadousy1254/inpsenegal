"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  onClick?: () => void;
  hasDropdown?: boolean;
  isOpen?: boolean;
}

export function NavItem({ href, label, onClick, hasDropdown, isOpen }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  const lineRef = useRef<HTMLSpanElement>(null);

  const handleEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = lineRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = (x / rect.width) * 100;
    // Start the line from the cursor position
    el.style.transition = "none";
    el.style.left = `${pct}%`;
    el.style.right = `${100 - pct}%`;
    // Force reflow then animate to full width
    void el.offsetWidth;
    el.style.transition = "left 0.35s cubic-bezier(0.25, 0.1, 0, 1), right 0.35s cubic-bezier(0.25, 0.1, 0, 1)";
    el.style.left = "0%";
    el.style.right = "0%";
  };

  const handleLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = lineRef.current;
    if (!el || isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = (x / rect.width) * 100;
    // Collapse the line toward the cursor exit position
    el.style.transition = "left 0.3s cubic-bezier(0.25, 0.1, 0, 1), right 0.3s cubic-bezier(0.25, 0.1, 0, 1)";
    el.style.left = `${pct}%`;
    el.style.right = `${100 - pct}%`;
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative flex items-center gap-1 whitespace-nowrap px-3 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] transition-colors duration-200",
        "hover:text-[var(--inp-vert)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2 rounded-sm",
        isActive
          ? "text-[var(--inp-vert)]"
          : "text-foreground/75"
      )}
    >
      {label}
      {hasDropdown && (
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isOpen ? "rotate-180 text-[var(--inp-vert)]" : "rotate-0 text-foreground/50",
            "group-hover:text-[var(--inp-vert)]"
          )}
        />
      )}
      {/* Animated underline */}
      <span
        ref={lineRef}
        className="pointer-events-none absolute bottom-0 h-[2px] bg-[var(--inp-vert)]"
        style={{
          left: isActive ? "0%" : "50%",
          right: isActive ? "0%" : "50%",
          transition: "left 0.35s cubic-bezier(0.25, 0.1, 0, 1), right 0.35s cubic-bezier(0.25, 0.1, 0, 1)",
        }}
        aria-hidden
      />
    </Link>
  );
}
