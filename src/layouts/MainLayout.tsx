import {
  ChevronDown,
  ChevronRight,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  MinusCircle,
  PlusCircle,
  Settings,
  Shield,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useNavigate, useRouter, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    await router.invalidate();
    navigate({ to: '/login' });
  };
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search as { tab?: string };

  const isSettingsActive = currentPath === '/settings';
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);

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

          <nav className='px-4 space-y-1.5'>
            {/* Dashboard */}
            <Link
              to='/'
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPath === '/'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <LayoutDashboard size={20} />
              <span className='font-medium'>Dashboard</span>
            </Link>

            {/* Registrar Entrada */}
            <Link
              to='/entrada'
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPath === '/entrada'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <PlusCircle size={20} />
              <span className='font-medium'>Registrar Entrada</span>
            </Link>

            {/* Registrar Salida */}
            <Link
              to='/salida'
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPath === '/salida'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <MinusCircle size={20} />
              <span className='font-medium'>Registrar Salida</span>
            </Link>

            {/* Configuración Desplegable (Solo ADMIN) */}
            {user?.role === 'ADMIN' && (
              <div className='space-y-1'>
                <button
                  type='button'
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isSettingsActive
                      ? 'text-white bg-slate-800/80 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <Settings size={20} />
                    <span className='font-medium'>Configuración</span>
                  </div>
                  {isSettingsOpen ? (
                    <ChevronDown size={16} className='text-slate-500' />
                  ) : (
                    <ChevronRight size={16} className='text-slate-500' />
                  )}
                </button>

                {/* Submenú desplegable */}
                {isSettingsOpen && (
                  <div className='pl-8 pr-2 space-y-1 animate-in slide-in-from-top-2 duration-150'>
                    <Link
                      to='/settings'
                      search={{ tab: 'general' }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isSettingsActive && (currentSearch?.tab === 'general' || !currentSearch?.tab)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <Layers size={14} />
                      <span>Tarifas y Espacios</span>
                    </Link>

                    <Link
                      to='/settings'
                      search={{ tab: 'operators' }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isSettingsActive && currentSearch?.tab === 'operators'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <Users size={14} />
                      <span>Operadores</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Arqueo de Caja */}
            <Link
              to='/arqueo'
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPath === '/arqueo'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <History size={20} />
              <span className='font-medium'>Arqueo de Caja</span>
            </Link>
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
            onClick={handleLogout}
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
