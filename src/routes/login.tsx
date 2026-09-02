import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '../pages/Login';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    // Si ya está autenticado, no tiene sentido mostrar el login
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});
