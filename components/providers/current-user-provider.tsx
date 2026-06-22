"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { UserRole } from "@/lib/permissions/roles";
import type { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";

export type CurrentDbUser = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  occupation: string;
  section: (typeof SENEGAL_REGIONS)[number];
  role: UserRole;
  avatar?: string;
};

type CurrentUserContextValue = {
  user: CurrentDbUser | null;
  isLoading: boolean;
};

const CurrentUserContext = createContext<CurrentUserContextValue>({
  user: null,
  isLoading: true,
});

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentDbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        if (!cancelled && response.ok && data.user) {
          setUser(data.user as CurrentDbUser);
        }
      } catch (error) {
        console.error("CurrentUserProvider:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={{ user, isLoading }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentDbUser() {
  return useContext(CurrentUserContext);
}
