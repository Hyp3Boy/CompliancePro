import { Box, Toolbar } from '@mui/material';
import { Header } from './Header';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Toolbar />
      {/* Agrega un Toolbar para empujar el contenido hacia abajo y evitar que quede oculto detrás del Header */}
      <Box component="main">
        {children}
      </Box>
    </>
  );
};