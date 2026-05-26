"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type SessionUser,
  getCurrentSessionUser,
  loginWithPassword,
  onSessionChange,
  registerWithPassword,
  signOut,
} from "@/lib/auth";
import { REGISTRATION_PASSPHRASE } from "@/lib/config";

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    name: string,
    email: string,
    password: string,
    passphrase: string
  ) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => {};

    async function loadSession() {
      try {
        const sessionUser = await getCurrentSessionUser();
        if (mounted) setUser(sessionUser);

        unsubscribe = onSessionChange((nextUser) => {
          if (mounted) setUser(nextUser);
        });
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadSession();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const result = await loginWithPassword(email, password);
      if (result.error) return result.error;
      setUser(result.user);
      return null;
    } catch {
      return "Nao foi possivel conectar ao Supabase.";
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    passphrase: string
  ): Promise<string | null> => {
    if (passphrase !== REGISTRATION_PASSPHRASE) return "Senha de cadastro incorreta.";

    try {
      const result = await registerWithPassword(name, email, password);
      if (result.error) return result.error;
      setUser(result.user);
      return null;
    } catch {
      return "Nao foi possivel conectar ao Supabase.";
    }
  }, []);

  const logout = useCallback(() => {
    void signOut().finally(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
