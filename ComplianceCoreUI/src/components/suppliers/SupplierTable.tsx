import { Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SecurityIcon from '@mui/icons-material/Security';
import type { Supplier } from '../../types/supplier';
import { DataGrid, type GridRenderCellParams } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid/internals';

interface SupplierTableProps {
  suppliers: Supplier[] | null;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onScreening: (supplier: Supplier) => void;
}

export const SupplierTable = ({ suppliers, onEdit, onDelete, onScreening }: SupplierTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columns: GridColDef[] = [
    { field: 'nombreComercial', headerName: 'Nombre Comercial', minWidth: 200, flex: 1.5 },
    { field: 'pais', headerName: 'País', minWidth: 120, flex: 1 },
    { field: 'identificacionTributaria', headerName: 'ID Tributario', minWidth: 150, flex: 1 },
    { field: 'correoElectronico', headerName: 'Correo Electrónico', minWidth: 220, flex: 1.5 },
    { field: 'fechaUltimaEdicion', headerName: 'Última Edición', minWidth: 150, flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      minWidth: 150,
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams<Supplier, Supplier>) => (
        <Box>
          <IconButton onClick={() => onEdit(params.row as Supplier)} color="primary" aria-label="edit"><EditIcon /></IconButton>
          <IconButton onClick={() => onDelete(params.row as Supplier)} color="error" aria-label="delete"><DeleteOutlineIcon /></IconButton>
          <IconButton onClick={() => onScreening(params.row as Supplier)} color="default" aria-label="screening"><SecurityIcon /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ height: 650, width: '100%' }}>
            <DataGrid
                rows={suppliers ?? []}
                columns={columns}
                getRowId={(row) => row.proveedorID}
                slots={{ toolbar: GridToolbar }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                  columns: {
                    columnVisibilityModel: {
                      identificacionTributaria: !isMobile,
                      correoElectronico: !isMobile,
                      fechaUltimaEdicion: !isMobile,
                    },
                  },
                }}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                autoHeight
            />
        </Box>
    </Paper>
  );
};