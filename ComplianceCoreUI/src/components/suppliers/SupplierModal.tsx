import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import type { Supplier } from '../../types/supplier';
import { useEffect } from 'react';
import { supplierSchema, type SupplierFormData } from '../../utils/validationSchemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const style = {
  position: 'absolute',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%', maxWidth: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24, p: 4,
};

interface SupplierModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  supplierToEdit: Supplier | null;
}

export const SupplierModal = ({ open, onClose, onSave, supplierToEdit }: SupplierModalProps) => {
  // 2. Configurar React Hook Form
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    mode: 'onBlur',
    defaultValues: {
      fechaUltimaEdicion: new Date().toISOString().split('T')[0],
    }
  });

  // 3. Rellenar el formulario cuando el modal se abre o el proveedor a editar cambia
  useEffect(() => {
    if (open) {
      if (supplierToEdit) {
        reset(supplierToEdit); // Rellena el form con los datos a editar
      } else {
        // Establece valores por defecto para un nuevo proveedor
        reset({
          fechaUltimaEdicion: new Date().toISOString().split('T')[0],
          
        });
      }
    }
  }, [supplierToEdit, open, reset]);
  
  // 4. Esta función solo se ejecuta si la validación es exitosa
  const onFormSubmit = (data: SupplierFormData) => {
    onSave(data as Supplier);
    onClose();
  };

  const title = supplierToEdit ? 'Editar Proveedor' : 'Añadir Nuevo Proveedor';

  return (
    <Modal open={open} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={style}>
        <Typography variant="h6" component="h2" sx={{ pb: 2 }}>{title}</Typography>
        <Grid container spacing={2} sx={{ pt: 2, pr: 2 }}>
          {/* Fila 1 */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('nombreComercial')}
              label="Nombre Comercial"
              fullWidth
              required
              error={!!errors.nombreComercial}
              helperText={errors.nombreComercial?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('razonSocial')}
              label="Razón Social"
              fullWidth
              required
              error={!!errors.razonSocial}
              helperText={errors.razonSocial?.message}
            />
          </Grid>
          
          {/* Fila 2 */}
          <Grid size={{ xs: 12, sm: 6 }}>
             <TextField
              {...register('identificacionTributaria')}
              label="ID Tributario (11 dígitos)"
              fullWidth
              required
              error={!!errors.identificacionTributaria}
              helperText={errors.identificacionTributaria?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('pais')}
              label="País"
              fullWidth
              required
              error={!!errors.pais}
              helperText={errors.pais?.message}
            />
          </Grid>


          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('correoElectronico')}
              label="Correo Electrónico"
              type="email"
              fullWidth
              required
              error={!!errors.correoElectronico}
              helperText={errors.correoElectronico?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('facturacionAnualUSD')}
              label="Facturación Anual (USD)"
              type="number"
              fullWidth
              required
              error={!!errors.facturacionAnualUSD}
              helperText={errors.facturacionAnualUSD?.message}
            />
          </Grid>

          {/* Fila 4: Campos faltantes */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('numeroTelefonico')}
              label="Número Telefónico"
              fullWidth
              required
              error={!!errors.numeroTelefonico}
              helperText={errors.numeroTelefonico?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('direccionFisica')}
              label="Dirección Física"
              fullWidth
              required
              error={!!errors.direccionFisica}
              helperText={errors.direccionFisica?.message}
            />
          </Grid>

          {/* Opcional: sitioWeb */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('sitioWeb')}
              label="Sitio Web"
              fullWidth
              error={!!errors.sitioWeb}
              helperText={errors.sitioWeb?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">Guardar</Button>
        </Box>
      </Box>
    </Modal>
  );
};