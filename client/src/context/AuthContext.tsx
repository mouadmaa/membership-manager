import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ApiError,
  getFetcher,
  getToken,
  postFetcher,
  setToken,
} from 'src/api/fetcher';
import type { AuthResponse, User } from 'src/types/auth/auth';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  national_id: string;
  phone?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const storedToken = getToken();
    if (!storedToken) {
      setUser(null);
      setTokenState(null);
      setLoading(false);
      return;
    }

    try {
      const me = await getFetcher('/me');
      setUser(me);
      setTokenState(storedToken);
    } catch {
      setToken(null);
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    const data = (await postFetcher('/login', { email, password })) as AuthResponse;
    setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = (await postFetcher('/register', data)) as AuthResponse;
    setToken(response.token);
    setTokenState(response.token);
    setUser(response.user);
    return response.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await postFetcher('/logout', {});
      }
    } catch {
      // ignore logout errors
    } finally {
      setToken(null);
      setTokenState(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }
  return context;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.errors) {
      const first = Object.values(error.errors)[0];
      if (first?.[0]) {
        return first[0];
      }
    }
    return error.message;
  }
  return 'Something went wrong';
}
