import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { CheckOut } from '../../pages/checkOut';

const checkOutSearchSchema = z.object({
  plate: z.string().optional(),
});

export const Route = createFileRoute('/_authenticated/salida')({
  validateSearch: checkOutSearchSchema,
  component: CheckOut,
});
