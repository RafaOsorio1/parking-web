import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { Settings } from '../../pages/Settings';

const settingsSearchSchema = z.object({
  tab: z.enum(['general', 'operators']).optional(),
});

export const Route = createFileRoute('/_authenticated/settings')({
  validateSearch: settingsSearchSchema,
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
