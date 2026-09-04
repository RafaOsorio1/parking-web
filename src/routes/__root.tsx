import { createRootRouteWithContext, Navigate, Outlet } from '@tanstack/react-router';
import type { AuthContextType } from '../context/AuthContext';

export interface RouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <Navigate to='/' />,
});

function RootComponent() {
  return <Outlet />;
}
