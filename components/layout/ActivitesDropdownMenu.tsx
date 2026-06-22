"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ACTIVITES_SUBLINKS } from "./activites-nav";

interface ActivitesDropdownMenuProps {
    open: boolean;
    onClose: () => void;
}

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

export function ActivitesDropdownMenu({ open, onClose }: ActivitesDropdownMenuProps) {
    const pathname = usePathname();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const el = ref.current;
        if (!el) return;
        const focusables = el.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        first?.focus();

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "Tab" && first && last) {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={ref}
                    className="absolute left-0 top-full z-50 mt-3 w-[280px]"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    onMouseLeave={onClose}
                    role="dialog"
                    aria-label="Menu Activités"
                >
                    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                        <ul className="space-y-1">
                            {ACTIVITES_SUBLINKS.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    pathname.startsWith(item.href + "/");
                                return (
                                    <li key={item.href} className="w-full">
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={`
                        group relative block w-full px-4 py-3 text-[14px] font-medium transition-all duration-300 rounded-lg border
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2
                        hover:bg-gradient-to-r hover:from-[#4A2F1A] hover:to-[#8b5e3c] hover:text-white hover:shadow-md hover:border-transparent
                        before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-lg before:bg-amber-700 before:transition-transform before:duration-300 before:content-[''] before:z-10
                        ${isActive
                                                    ? "bg-amber-50 text-amber-900 border-amber-200 before:scale-y-100"
                                                    : "bg-transparent text-gray-800 border-transparent before:scale-y-0 before:origin-top group-hover:before:scale-y-100"}
                      `}
                                        >
                                            <span className="relative z-[1]">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
