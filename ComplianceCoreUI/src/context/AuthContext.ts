import { createContext } from 'react';
import type { User } from '../types/user';
import type { LoginFormInputs } from '../utils/validationSchemas';

// 1. Define la "forma" de los datos que compartirá el contexto
export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginFormInputs) => Promise<void>;
  logout: () => void;
}

// 2. Crea y exporta el Contexto para que otros archivos puedan usarlo
export const AuthContext = createContext<AuthContextType | undefined>(undefined);