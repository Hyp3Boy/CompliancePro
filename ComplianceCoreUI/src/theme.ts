import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark', // ¡Activamos el modo oscuro!
    primary: {
      main: '#FFC107', // Un amarillo vibrante, como en el mockup (puedes ajustarlo)
    },
     secondary: { // <-- ¡NUEVA SECCIÓN!
      main: '#B0BEC5', // Un gris azulado claro
    },
    background: {
      default: '#1a1a2e', // Un fondo "black purple" corporativo
      paper: '#162447',   // Un color ligeramente más claro para elementos como tablas y modales
    },
    text: {
      primary: '#e3e3e3',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Nunito Sans", Arial, sans-serif', 
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          // Usamos el color 'paper' de nuestro propio tema.
          backgroundColor: theme.palette.background.paper,
          // Eliminamos la sombra por defecto para un look más plano y moderno
          boxShadow: 'none',
          backgroundImage: 'none',
        }),
      },
    },
  },
});