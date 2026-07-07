import type { DefaultSession } from "next-auth";
import type { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";
import type { UserRole } from "@/lib/permissions/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstname: string;
      lastname: string;
      role: UserRole;
      section: (typeof SENEGAL_REGIONS)[number];
      occupation: string;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    firstname: string;
    lastname: string;
    role: UserRole;
    section: (typeof SENEGAL_REGIONS)[number];
    occupation: string;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstname: string;
    lastname: string;
    role: UserRole;
    section: (typeof SENEGAL_REGIONS)[number];
    occupation: string;
    avatar?: string;
  }
}
