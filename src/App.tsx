import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { routeTree } from './routeTree.gen';

// Usamos createHashHistory para compatibilidad directa con Electron/SPAs estáticas
const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  history: hashHistory,
  context: {
    auth: undefined!, // Se inyecta dinámicamente en el componente
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
