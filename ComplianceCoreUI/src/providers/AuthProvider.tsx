import { useState, type ReactNode } from 'react';
import type { User } from '../types/user';
import type { LoginFormInputs } from '../utils/validationSchemas';
import { loginUser } from '../api/authAPI';
// Importa el contexto desde su nuevo archivo
import { AuthContext } from '../context/AuthContext';

const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error al parsear el usuario desde localStorage", error);
      localStorage.removeItem('user'); // Limpiar dato corrupto
      return null;
    }
  }
  return null;
};

// 3. Crea el componente "Proveedor" que contendrá toda la lógica
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

  // 4. Proporciona el estado y las funciones a todos los componentes hijos
  const value = { token, user, isLoading, error, login, logout };

  // Usa el AuthContext importado en el Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};