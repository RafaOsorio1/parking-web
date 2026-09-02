import { createFileRoute, redirect } from '@tanstack/react-router';
import { MainLayout } from '../layouts/MainLayout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    // Si aún está cargando la sesión inicial, no bloquear
    if (context.auth.isLoading) return;

    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: MainLayout,
});
