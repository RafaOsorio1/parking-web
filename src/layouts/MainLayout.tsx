import {
  History,
  LayoutDashboard,
  MinusCircle,
  PlusCircle,
  Settings,
  UserCircle,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function MainLayout() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/entrada', label: 'Registrar Entrada', icon: PlusCircle },
    { path: '/salida', label: 'Registrar Salida', icon: MinusCircle },
    { path: '/settings', label: 'Configuración', icon: Settings },
    { path: '/arqueo', label: 'Arqueo de Caja', icon: History },
  ];

  return (
    <div className='flex h-screen bg-slate-950 text-slate-100 overflow-hidden'>
      {/* Sidebar */}
      <aside className='w-64 bg-slate-900 border-r border-slate-800 flex flex-col'>
        <div className='p-6'>
          <h1 className='text-2xl font-bold text-blue-400 flex items-center gap-2'>
            🚗 ParkingPro
          </h1>
        </div>

        <nav className='flex-1 px-4 space-y-2'>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon size={20} />
              <span className='font-medium'>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className='p-4 border-t border-slate-800'>
          <div className='flex items-center gap-3 px-4 py-3'>
            <UserCircle className='text-slate-500' />
            <div>
              <p className='text-sm font-semibold'>Operador Local</p>
              <p className='text-xs text-slate-500'>Offline Ready</p>
            </div>
          </div>
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
