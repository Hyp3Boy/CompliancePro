import { createContext } from 'react';
import type { User } from '../types/user';
import type { LoginFormInputs } from '../utils/validationSchemas';

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginFormInputs) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);