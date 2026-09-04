import { createFileRoute, redirect } from '@tanstack/react-router';
import { MainLayout } from '../layouts/MainLayout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
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
