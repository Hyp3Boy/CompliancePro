import { useState, type ReactNode } from 'react';
import type { User } from '../types/user';
import type { LoginFormInputs } from '../utils/validationSchemas';
import { loginUser } from '../api/authAPI';
import { AuthContext } from '../context/AuthContext';

const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error al parsear el usuario desde localStorage", error);
      localStorage.removeItem('user'); // Limpiar data
      return null;
    }
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginFormInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken, user: loggedInUser } = await loginUser(credentials);
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setToken(accessToken);
      setUser(loggedInUser);
    } catch {
      setError('Las credenciales son incorrectas. Por favor, inténtalo de nuevo.');
      throw new Error('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, isLoading, error, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};