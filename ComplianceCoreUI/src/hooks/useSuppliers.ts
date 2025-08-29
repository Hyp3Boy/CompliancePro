
import { useEffect, useState, useCallback } from 'react';
import type { Supplier } from '../types/supplier';
import { useAuth } from './useAuth'; 
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from '../api/suppliersAPI';
export const useSuppliers = () => {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para la carga inicial
  const [error, setError] = useState<string | null>(null);

  // Estados para los modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  const [supplierToScreen, setSupplierToScreen] = useState<Supplier | null>(null);

  // Función para cargar los datos de la API
  const fetchSuppliers = useCallback(async () => {
    if (!token) {
      setError("No estás autenticado.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSuppliers(token);
      setSuppliers(data);
    } catch (err) {
      setError('Error al cargar los proveedores. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Cargar datos al montar el componente si hay un token
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // --- Manejadores para el Modal de Edición/Creación ---
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSupplierToEdit(null);
  };

  const handleAddClick = () => {
    setSupplierToEdit(null); // Nos aseguramos de que no haya datos de edición
    setIsEditModalOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setIsEditModalOpen(true);
  };

  const handleSaveSupplier = async (supplierData: Supplier) => {
    if (!token) return;

    try {
      if (supplierToEdit) {
        // Editar existente
        await updateSupplier(supplierToEdit.proveedorID, supplierData, token);
      } else {
        // Agregar nuevo
        await createSupplier(supplierData, token);
      }
      handleCloseEditModal();
      await fetchSuppliers(); 
    } catch (err) {
      setError('Error al guardar el proveedor.');
      console.error(err);
    }
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSupplierToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete || !token) return;
    try {
      await deleteSupplier(supplierToDelete.proveedorID, token);
      handleCloseDeleteModal();
      await fetchSuppliers();
    } catch (err) {
      setError('Error al eliminar el proveedor.');
      console.error(err);
    }
  };

  const handleScreeningClick = (supplier: Supplier) => {
    setSupplierToScreen(supplier);
    setIsScreeningModalOpen(true);
  };

  const handleCloseScreeningModal = () => {
    setIsScreeningModalOpen(false);
    setSupplierToScreen(null);
  };

  return {
    suppliers,
    isLoading,
    error,
    modals: {
      edit: {
        isOpen: isEditModalOpen,
        supplierToEdit: supplierToEdit,
      },
      delete: {
        isOpen: isDeleteModalOpen,
        supplierToDelete: supplierToDelete,
      },
      screening: {
        isOpen: isScreeningModalOpen,
        supplierToScreen: supplierToScreen,
      },
    },
    actions: {
      add: handleAddClick,
      edit: handleEditClick,
      save: handleSaveSupplier,
      delete: handleDeleteClick,
      closeEditModal: handleCloseEditModal,
      closeDeleteModal: handleCloseDeleteModal,
      confirmDelete: handleConfirmDelete,
      screening: handleScreeningClick,
      closeScreeningModal: handleCloseScreeningModal,
    },
  };
};