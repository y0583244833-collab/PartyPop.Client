import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '../api/client';
import { authApi } from '../api/endpoints';
import type { User } from '../api/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

/** מחזיק את המשתמש המחובר. ה-JWT נשמר ב-localStorage ונשלח בכל קריאה (api/client.ts). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // בעלייה: אם יש Token שמור, בודקים מול השרת שהוא עדיין בתוקף
  useEffect(() => {
    if (!tokenStorage.get()) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    tokenStorage.set(result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    queryClient.clear();   // לא משאירים בזיכרון נתונים של המשתמש הקודם
  }, [queryClient]);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
