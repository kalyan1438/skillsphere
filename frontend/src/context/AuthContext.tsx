import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Admin } from '@/types';

interface AuthCtx {
  admin: Admin | null;
  loading: boolean;
  login:  (token: string, data: Admin) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin,   setAdmin]   = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true); // true until rehydrated

  useEffect(() => {
    try {
      const token = localStorage.getItem('adminToken');
      const user  = localStorage.getItem('adminUser');
      if (token && user) {
        setAdmin(JSON.parse(user));
      }
    } catch {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    } finally {
      setLoading(false);
    }
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

  return (
    <Ctx.Provider value={{ admin, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
};
