import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { routeTree } from './routeTree.gen';

// Limpia cualquier hash residual (#) del router anterior para usar URLs estándar y limpias
if (typeof window !== 'undefined' && window.location.hash) {
  const hashContent = window.location.hash.replace(/^#\/?/, '/');
  const targetPath = hashContent.startsWith('/') ? hashContent : `/${hashContent}`;
  window.history.replaceState(null, '', targetPath === '/' ? '/' : targetPath);
}

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
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

  // Esperar a que el backend responda si hay sesión activa antes de montar el router
  if (auth.isLoading) {
    return (
      <div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4'>
        <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
        <p className='text-sm text-slate-500 font-medium'>Iniciando ParkingPro...</p>
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
