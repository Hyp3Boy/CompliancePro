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
      <Box component="main">
        {children}
      </Box>
    </>
  );
};