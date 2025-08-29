import { useEffect, useState } from 'react';
import { Modal, Box, Typography, CircularProgress, Alert, Paper, Grid } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import type { Supplier } from '../../types/supplier';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { ScreeningResults } from '../../types/screeing';
import { fetchScreeningResults } from '../../api/screeingAPI';

// --- Definiciones de Columnas para cada Tabla ---
const offshoreColumns: GridColDef[] = [
  { field: 'entity', headerName: 'Entity', flex: 1 },
  { field: 'jurisdiction', headerName: 'Jurisdiction', flex: 1 },
  { field: 'linkedTo', headerName: 'Linked To', flex: 1 },
  { field: 'dataFrom', headerName: 'Data From', flex: 1 },
];

const worldBankColumns: GridColDef[] = [
  { field: 'firmName', headerName: 'Firm Name', flex: 1 },
  { field: 'country', headerName: 'Country', flex: 0.5 },
  { field: 'address', headerName: 'Address', flex: 1.5 },
  { field: 'grounds', headerName: 'Grounds', flex: 1.5 },
  { field: 'fromDate', headerName: 'From', flex: 0.5 },
  { field: 'toDate', headerName: 'To', flex: 0.5 },
];

const ofacColumns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1.5 },
  { field: 'type', headerName: 'Type', flex: 0.5 },
  { field: 'program', headerName: 'Program', flex: 1 },
  { field: 'list', headerName: 'List', flex: 0.5 },
  { field: 'score', headerName: 'Score', flex: 0.3 },
];

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', maxWidth: 1200,
  height: '90vh', bgcolor: 'background.paper',
  border: '2px solid #000', boxShadow: 24, p: 4,
  display: 'flex', flexDirection: 'column',
};

function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
      }}
    >
      <Typography>No se encontraron resultados en esta fuente.</Typography>
    </Box>
  );
}


interface ScreeningModalProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export const ScreeningResultsModal = ({ open, onClose, supplier }: ScreeningModalProps) => {
  const { token } = useAuth();
  const [results, setResults] = useState<ScreeningResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Solo buscar si el modal está abierto, hay un proveedor y un token.
    if (open && supplier && token) {
      const performScreening = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
          const data = await fetchScreeningResults(supplier.nombreComercial, token);
          setResults(data);
        } catch (err) {
          setError('Ocurrió un error al realizar el screening.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      performScreening();
    }
  }, [open, supplier, token]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Resultados del Screening para: <strong>{supplier?.nombreComercial}</strong>
        </Typography>

        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}

        {!isLoading && !error && (
          <Grid container spacing={2} sx={{ overflowY: 'auto' }}>
            {/* --- Tabla 1: Offshore Leaks --- */}
            <Grid size={12}> 
              <Typography variant="h6">Offshore Leaks Database (ICIJ)</Typography>
              <Paper sx={{ height: 250, width: '100%' }}>
                <DataGrid
                  rows={results?.offshoreLeaks ?? []} 
                  columns={offshoreColumns}
                  slots={{ noRowsOverlay: CustomNoRowsOverlay }} // <-- ¡Aquí está la magia!
                  pageSizeOptions={[5]}
                />
              </Paper>
            </Grid>
            
            {/* --- Tabla 2: World Bank --- */}
            <Grid size={12}>
              <Typography variant="h6">The World Bank Debarred Firms</Typography>
              <Paper sx={{ height: 250, width: '100%' }}>
                <DataGrid
                  rows={results?.worldBank ?? []}
                  columns={worldBankColumns}
                  slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                  pageSizeOptions={[5]}
                />
              </Paper>
            </Grid>

            {/* --- Tabla 3: OFAC --- */}
            <Grid size={12}>
              <Typography variant="h6">OFAC Sanctions List</Typography>
              <Paper sx={{ height: 250, width: '100%' }}>
                <DataGrid
                  rows={results?.ofac ?? []}
                  columns={ofacColumns}
                  slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                  pageSizeOptions={[5]}
                />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};