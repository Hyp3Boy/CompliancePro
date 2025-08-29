// src/App.tsx

import { Layout } from './components/common/Layout';
import { SuppliersPage } from './features/suppliers/SupplierPage';
import { LoginPage } from './features/auth/LoginPage';
// Asegúrate de importar tu hook personalizado
import { useAuth } from './hooks/useAuth';

function App() {
  // Ahora useAuth funcionará y obtendrá el token del AuthContext
  const { token } = useAuth();

  // Esta lógica es correcta: si no hay token, muestra LoginPage, si lo hay, muestra SuppliersPage
  if (!token) {
    return (
      <Layout>
        <LoginPage />
      </Layout>
    );
  }

  return (
    <Layout>
      <SuppliersPage />
    </Layout>
  );
}

export default App;