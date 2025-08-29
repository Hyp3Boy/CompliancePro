import { Box, Paper, Typography } from '@mui/material';
import { LoginForm } from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import type { LoginFormInputs } from '../../utils/validationSchemas';
import useTitle from '../../hooks/useTitle';

export const LoginPage = () => {
  useTitle('CompliencePro | Iniciar Sesión');
  const { login, isLoading, error } = useAuth();

  const handleLoginSubmit = (data: LoginFormInputs) => {
    login(data);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: '450px',
          borderRadius: '12px',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Inicio de Sesión
        </Typography>
        <Typography variant="body1" component="p" sx={{ mb: 4 }}>
          Hola, bienvenido de nuevo!
        </Typography>
        <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} error={error} />
      </Paper>
    </Box>
  );
};