import axios from 'axios';
import type { AuthResponse } from '../types/auth';
import type { LoginFormInputs } from '../utils/validationSchemas';


// 1. Accedemos a la variable de entorno a través de import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 2. Construimos la URL completa para el endpoint de login
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;

export const loginUser = async (credentials: LoginFormInputs): Promise<AuthResponse> => {
  const { data } = await axios.post<AuthResponse>(LOGIN_ENDPOINT, credentials);
  return data;
};