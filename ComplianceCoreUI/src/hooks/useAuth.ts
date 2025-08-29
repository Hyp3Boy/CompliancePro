import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  // Pasa el AuthContext a useContext para que sepa qué consumir
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};