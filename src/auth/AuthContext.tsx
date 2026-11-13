import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const result = await apiRequest<{ user: AuthUser }>("/api/auth/me");
      setUser(result.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const signIn = async (email: string, password: string) => {
    const result = await apiRequest<{ user: AuthUser }>("/api/auth/login", {
      method: "POST", body: JSON.stringify({ email, password }),
    });
    setUser(result.user);
  };

  const register = async (displayName: string, email: string, password: string) => {
    const result = await apiRequest<{ user: AuthUser }>("/api/auth/register", {
      method: "POST", body: JSON.stringify({ displayName, email, password }),
    });
    setUser(result.user);
  };

  const signOut = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  return <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
