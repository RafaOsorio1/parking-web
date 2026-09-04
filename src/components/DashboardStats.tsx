import { Accessibility, Activity, Car, Hash } from 'lucide-react';

import type { Spot, Ticket } from '../types/parking';

interface DashboardStatsProps {
  activeTickets: Ticket[];
  spots: Spot[];
  apiStatus: string;
}

export function DashboardStats({
  activeTickets,
  spots,
  apiStatus,
}: DashboardStatsProps) {
  const totalSpots = spots.length;
  const occupiedSpots = spots.filter((s) => s.status === 'OCCUPIED').length;
  const occupancyPercent =
    totalSpots === 0 ? 0 : Math.round((occupiedSpots / totalSpots) * 100);

  const carTickets = activeTickets.filter(
    (t) => t.vehicle?.type === 'CAR',
  ).length;
  const bikeTickets = activeTickets.filter(
    (t) => t.vehicle?.type === 'MOTORCYCLE',
  ).length;

  const accessibleSpots = spots.filter((s: any) => s.isAccessible);
  const freeAccessible = accessibleSpots.filter(
    (s) => s.status === 'AVAILABLE',
  ).length;

  const stats = [
    {
      label: 'Vehículos Activos',
      value: activeTickets.length,
      icon: Hash,
      color: 'text-blue-400',
    },
    {
      label: 'Ocupación General',
      value: `${occupancyPercent}%`,
      icon: Activity,
      color: occupancyPercent > 80 ? 'text-red-400' : 'text-emerald-400',
    },
    {
      label: 'Carros / Motos',
      value: `${carTickets} / ${bikeTickets}`,
      icon: Car,
      color: 'text-purple-400',
    },
    {
      label: 'Espacios PMR ♿',
      value: accessibleSpots.length > 0 ? `${freeAccessible} de ${accessibleSpots.length}` : '0',
      sublabel: accessibleSpots.length > 0 ? (freeAccessible > 0 ? 'Disponibles' : 'Agotados') : 'Sin configurar',
      icon: Accessibility,
      color: freeAccessible > 0 ? 'text-blue-400' : 'text-slate-500',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className='bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden'
        >
          <div className='absolute -right-4 -top-4 opacity-5'>
            <stat.icon size={100} />
          </div>
          <div className='flex items-center justify-between mb-4 relative z-10'>
            <div className={`p-3 rounded-xl bg-slate-950/50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full ${
                apiStatus === 'OK' ? 'text-slate-500' : 'text-red-400'
              }`}
            >
              {apiStatus === 'OK' ? 'Live' : apiStatus}
            </span>
          </div>
          <p className='text-4xl font-black tracking-tight text-white relative z-10'>
            {stat.value}
          </p>
          <p className='text-sm font-medium text-slate-400 mt-1 relative z-10 flex items-center justify-between'>
            <span>{stat.label}</span>
            {stat.sublabel && (
              <span className='text-xs text-blue-400 font-bold'>
                {stat.sublabel}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
