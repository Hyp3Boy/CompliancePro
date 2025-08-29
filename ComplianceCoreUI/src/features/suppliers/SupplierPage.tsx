import { Box, Button, Container, Typography, CircularProgress, Alert } from '@mui/material'; 
import AddIcon from '@mui/icons-material/Add';
import { SupplierTable } from '../../components/suppliers/SupplierTable';
import { SupplierModal } from '../../components/suppliers/SupplierModal';
import { useSuppliers } from '../../hooks/useSuppliers';
import useTitle from '../../hooks/useTitle';
import { SupplierConfirmationModal } from '../../components/suppliers/SupplierConfirmationModal';
import { ScreeningResultsModal } from '../../components/suppliers/ScreeningResultsModal';

export const SuppliersPage = () => {
  useTitle('CompliancePro | Proveedores');

  const { 
    suppliers, 
    isLoading, 
    error, 
    modals, 
    actions 
  } = useSuppliers();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* --- CABECERA DE LA PÁGINA (Sin cambios) --- */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Proveedores
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={actions.add}>
          Añadir Proveedor
        </Button>
      </Box>

      {/* --- TABLA DE PROVEEDORES --- */}
      <SupplierTable
        suppliers={suppliers}
        onEdit={actions.edit}
        onDelete={actions.delete}
        onScreening={actions.screening}
      />

      {/* --- MODAL DE EDICIÓN/CREACIÓN --- */}
      <SupplierModal
        open={modals.edit.isOpen}
        onClose={actions.closeEditModal}
        onSave={actions.save}
        supplierToEdit={modals.edit.supplierToEdit}
      />

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {modals.delete.supplierToDelete && (
        <SupplierConfirmationModal
          open={modals.delete.isOpen}
          onClose={actions.closeDeleteModal}
          onConfirm={actions.confirmDelete}
          itemName={modals.delete.supplierToDelete.nombreComercial}
        />
      )}

      {/* <-- MODAL DE SCREENING --> */}
      <ScreeningResultsModal
        open={modals.screening.isOpen}
        onClose={actions.closeScreeningModal}
        supplier={modals.screening.supplierToScreen}
      />
    </Container>
  );
};