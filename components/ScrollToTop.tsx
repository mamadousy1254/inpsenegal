"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * ScrollToTop — resets scroll position on every route change.
 * Uses `usePathname()` to detect navigation within Next.js App Router.
 * Must be rendered inside a Client Component boundary (layout wrapper).
 */
export function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Disable browser's native scroll restoration
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        // Instant scroll to top (no delay, no flash)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return null;
}
