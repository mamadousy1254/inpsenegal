import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { isMaintenanceModeEnabled } from "@/lib/services/site-settings/maintenance-mode";

function isMaintenanceExempt(pathname: string): boolean {
  if (pathname === "/maintenance") return true;
  if (pathname.startsWith("/dashboard")) return true;
  if (pathname === "/login") return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/partage")) return true;
  if (pathname.startsWith("/espace-professionnel")) return true;
  return false;
}

export const proxy = auth(async (req) => {
  const { pathname } = req.nextUrl;

  try {
    const maintenanceOn = await isMaintenanceModeEnabled();

    if (maintenanceOn && !isMaintenanceExempt(pathname)) {
      return NextResponse.redirect(new URL("/maintenance", req.nextUrl.origin));
    }

    if (!maintenanceOn && pathname === "/maintenance") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  } catch (error) {
    console.error("proxy maintenance check", error);
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff2?)$).*)",
  ],
};
