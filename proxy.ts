import { auth } from "@/lib/auth/auth";

export const proxy = auth;

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
