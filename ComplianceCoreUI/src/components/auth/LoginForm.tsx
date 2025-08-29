import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormInputs,
} from "../../utils/validationSchemas";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // Evita que el input pierda el foco
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
      <TextField
        label="Nombre de usuario"
        type="text"
        variant="outlined"
        {...register("nombreUsuario")}
        error={!!errors.nombreUsuario}
        helperText={errors.nombreUsuario?.message}
        disabled={isLoading}
      />
      <TextField
        label="Contraseña"
        // El tipo cambia dinámicamente según el estado
        type={showPassword ? "text" : "password"}
        variant="outlined"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isLoading}
        // Aquí añadimos el adorno al final del input
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end">
                {/* Mostramos un ícono u otro según el estado */}
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading}
        sx={{ height: "56px" }}>
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Ingresar"
        )}
      </Button>
    </Box>
  );
};
