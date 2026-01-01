import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login';
import { Editor } from './pages/Editor';
import { MainLayout } from './layouts/MainLayout';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <MainLayout>
      <Editor />
    </MainLayout>
  );
}

export default App;