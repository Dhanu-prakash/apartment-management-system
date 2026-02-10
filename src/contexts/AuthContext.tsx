import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "@/types";
import { getUsers, getSession, setSession } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => string | null; // returns error or null
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getSession);

  const login = useCallback((email: string, password: string): string | null => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return "Invalid email or password";
    setSession(found);
    setUser(found);
    return null;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
