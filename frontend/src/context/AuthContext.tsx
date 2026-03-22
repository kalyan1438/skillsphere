import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Admin } from '@/types';

interface AuthCtx {
  admin: Admin | null;
  login:  (token: string, data: Admin) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    const u = localStorage.getItem('adminUser');
    if (t && u) setAdmin(JSON.parse(u));
  }, []);

  const login = (token: string, data: Admin) => {
    setAdmin(data);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(data));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  return <Ctx.Provider value={{ admin, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
};
