import { createFileRoute, redirect } from '@tanstack/react-router';
import { Settings } from '../../pages/Settings';

export const Route = createFileRoute('/_authenticated/settings')({
  beforeLoad: ({ context }) => {
    // Protección estricta: Solo ADMIN puede acceder a Configuración
    if (context.auth.user?.role !== 'ADMIN') {
      throw redirect({
        to: '/',
      });
    }
  },
  component: Settings,
});
