import { Layout } from './components/common/Layout';
import { SuppliersPage } from './features/suppliers/SupplierPage';
import { LoginPage } from './features/auth/LoginPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { token } = useAuth();

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