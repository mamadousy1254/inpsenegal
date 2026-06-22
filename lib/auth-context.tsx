"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type UserRole = "admin" | "chercheur" | "partenaire";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  institution?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/* ------------------------------------------------------------------ */
/*  Demo accounts (replace with Parse auth in production)              */
/* ------------------------------------------------------------------ */

const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  "admin@inp.gouv.sn": {
    password: "admin123",
    user: {
      id: "u1",
      fullName: "Dr. Ousmane Seck",
      email: "admin@inp.gouv.sn",
      role: "admin",
      institution: "INP",
    },
  },
  "chercheur@inp.gouv.sn": {
    password: "chercheur123",
    user: {
      id: "u2",
      fullName: "Dr. Aminata Ba",
      email: "chercheur@inp.gouv.sn",
      role: "chercheur",
      institution: "INP",
    },
  },
  "partenaire@fao.org": {
    password: "partenaire123",
    user: {
      id: "u3",
      fullName: "Jean Dupont",
      email: "partenaire@fao.org",
      role: "partenaire",
      institution: "FAO",
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "inp_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 800));

    const entry = DEMO_USERS[email.toLowerCase()];
    if (!entry || entry.password !== password) {
      throw new Error("Identifiants invalides");
    }

    setUser(entry.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
