import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginPage } from '../pages/Login';

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: ({ context }) => {
    // Si ya está autenticado, no tiene sentido mostrar el login
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});
