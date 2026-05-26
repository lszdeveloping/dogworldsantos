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
  type User,
  hashPassword,
  findUser,
  saveUser,
  emailExists,
  getSession,
  setSession,
  clearSession,
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
    setUser(getSession());
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const found = await findUser(email, password);
    if (!found) return "Email ou senha incorretos.";
    const session: SessionUser = { id: found.id, name: found.name, email: found.email };
    setSession(session);
    setUser(session);
    return null;
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    passphrase: string
  ): Promise<string | null> => {
    if (passphrase !== REGISTRATION_PASSPHRASE) return "Senha de cadastro incorreta.";
    if (emailExists(email)) return "Este email já está cadastrado.";
    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    };
    saveUser(newUser);
    const session: SessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    setSession(session);
    setUser(session);
    return null;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
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
