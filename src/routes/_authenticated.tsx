import { createFileRoute, Navigate, redirect, useLocation } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    // Si ya resolvió y no está autenticado, interceptar con redirect
    if (!context.auth.isLoading && !context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedComponent,
});

function AuthenticatedComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4'>
        <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
        <p className='text-sm text-slate-500 font-medium'>Cargando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' search={{ redirect: location.href }} />;
  }

  return <MainLayout />;
}
