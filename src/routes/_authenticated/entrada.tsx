import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { CheckIn } from '../../pages/checkIn';

const checkInSearchSchema = z.object({
  spot: z.string().optional(),
});

export const Route = createFileRoute('/_authenticated/entrada')({
  validateSearch: checkInSearchSchema,
  component: CheckIn,
});
