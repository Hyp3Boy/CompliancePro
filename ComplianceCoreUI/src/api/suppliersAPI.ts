import axios from 'axios';
import type { Supplier } from '../types/supplier';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const SUPPLIERS_ENDPOINT = `${API_BASE_URL}/proveedores`;

/**
 * Obtiene todos los proveedores.
 * @param token - El JWT para la autorización.
 */
export const getSuppliers = async (token: string): Promise<Supplier[]> => {
  const { data } = await axios.get(SUPPLIERS_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/**
 * Crea un nuevo proveedor.
 * El backend debería encargarse de generar el 'id'.
 * @param supplierData - Los datos del proveedor a crear (sin el 'id').
 * @param token - El JWT para la autorización.
 */
export const createSupplier = async (supplierData: Omit<Supplier, 'id'>, token: string): Promise<Supplier> => {
  const { data } = await axios.post(SUPPLIERS_ENDPOINT, supplierData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // La API debería devolver el proveedor recién creado, incluyendo su nuevo ID.
};

/**
 * Actualiza un proveedor existente.
 * @param supplierId - El ID del proveedor a actualizar.
 * @param supplierData - Los nuevos datos del proveedor.
 * @param token - El JWT para la autorización.
 */
export const updateSupplier = async (supplierId: number, supplierData: Supplier, token: string): Promise<Supplier> => {
  const { data } = await axios.put(`${SUPPLIERS_ENDPOINT}/${supplierId}`, supplierData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/**
 * Elimina un proveedor.
 * @param supplierId - El ID del proveedor a eliminar.
 * @param token - El JWT para la autorización.
 */
export const deleteSupplier = async (supplierId: number, token: string): Promise<void> => {
  await axios.delete(`${SUPPLIERS_ENDPOINT}/${supplierId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};