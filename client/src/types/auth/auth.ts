import type { ReactNode } from 'react';

export interface registerType {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
}

export interface loginType {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
