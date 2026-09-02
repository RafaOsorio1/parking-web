import { createFileRoute } from '@tanstack/react-router';
import { CashManagement } from '../../pages/CashManagement';

export const Route = createFileRoute('/_authenticated/arqueo')({
  component: CashManagement,
});
