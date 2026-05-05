'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'admin' | 'driver' | 'warehouse';
interface User { id: string; name: string; role: Role; warehouseId?: string; }
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS: Record<string, { password: string; user: User }> = {
  admin: { password: 'admin123', user: { id: 'ADM-001', name: 'Admin LogiTrack', role: 'admin' } },
  agus: { password: 'driver123', user: { id: 'DRV-001', name: 'Agus Pratama', role: 'driver' } },
  budi: { password: 'driver123', user: { id: 'DRV-002', name: 'Budi Santoso', role: 'driver' } },
  gudang1: { password: 'warehouse123', user: { id: 'WH-USER-1', name: 'Petugas Karawang', role: 'warehouse', warehouseId: 'WH-001' } },
  gudang2: { password: 'warehouse123', user: { id: 'WH-USER-2', name: 'Petugas Jakarta', role: 'warehouse', warehouseId: 'WH-002' } },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback((username: string, password: string) => {
    const record = USERS[username.toLowerCase()];
    if (record && record.password === password) {
      setUser(record.user);
      const role = record.user.role;
      let targetPath = '/admin/dashboard';
      if (role === 'driver') targetPath = '/driver/dashboard';
      if (role === 'warehouse') targetPath = '/warehouse/dashboard';
      
      router.push(targetPath);
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/login');
  }, [router]);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
