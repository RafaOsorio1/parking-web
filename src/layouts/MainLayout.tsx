import {
  History,
  LayoutDashboard,
  LogOut,
  MinusCircle,
  PlusCircle,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

export function MainLayout() {
  const { user, logout } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const baseMenuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/entrada', label: 'Registrar Entrada', icon: PlusCircle },
    { path: '/salida', label: 'Registrar Salida', icon: MinusCircle },
    { path: '/arqueo', label: 'Arqueo de Caja', icon: History },
  ];

  // Solo ADMIN puede ver Configuración
  const menuItems = user?.role === 'ADMIN'
    ? [
        ...baseMenuItems.slice(0, 3),
        { path: '/settings', label: 'Configuración', icon: Settings },
        baseMenuItems[3],
      ]
    : baseMenuItems;

  return (
    <div className='flex h-screen bg-slate-950 text-slate-100 overflow-hidden'>
      {/* Sidebar */}
      <aside className='w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between'>
        <div>
          <div className='p-6'>
            <h1 className='text-2xl font-bold text-blue-400 flex items-center gap-2'>
              🚗 ParkingPro
            </h1>
          </div>

          <nav className='px-4 space-y-2'>
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className='p-4 border-t border-slate-800 space-y-3'>
          <div className='flex items-center gap-3 px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80'>
            <div className='p-2 bg-blue-600/20 text-blue-400 rounded-lg'>
              {user?.role === 'ADMIN' ? <Shield size={18} /> : <User size={18} />}
            </div>
            <div className='flex-1 overflow-hidden'>
              <p className='text-sm font-bold text-white truncate'>{user?.name || 'Usuario'}</p>
              <p className='text-[10px] uppercase font-mono font-bold text-blue-400'>
                {user?.role === 'ADMIN' ? 'Administrador' : 'Operador'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className='w-full flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 py-2.5 rounded-xl transition-all'
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto p-8'>
        <div className='max-w-6xl mx-auto'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
