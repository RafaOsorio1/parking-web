import { Activity, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

import { ActiveTicketsTable } from '../components/ActiveTicketsTable';
import { DashboardStats } from '../components/DashboardStats';
import { ParkingMap } from '../components/ParkingMap';
import { useActiveTickets, useSpots } from '../hooks/useParking';

export function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    data: ticketsResponse,
    isLoading: isLoadingTickets,
    isError: isErrorTickets,
  } = useActiveTickets();
  const {
    data: spotsResponse,
    isLoading: isLoadingSpots,
    isError: isErrorSpots,
  } = useSpots();

  const activeTickets = ticketsResponse?.data || [];
  const spots = spotsResponse?.data || [];

  const apiStatus =
    !isLoadingTickets && !isLoadingSpots && (isErrorTickets || isErrorSpots)
      ? 'Offline'
      : 'OK';

  return (
    <div className='space-y-8 pb-12'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold flex items-center gap-3 text-white'>
            <Activity size={32} className='text-blue-500' />
            Operación en Tiempo Real
          </h1>
          <p className='text-slate-400 mt-2'>
            Control total de espacios y servicios activos.
          </p>
        </div>

        {/* Selector de Vista */}
        <div className='flex bg-slate-900 p-1 rounded-xl border border-slate-800'>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutGrid size={18} />
            Mapa
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <List size={18} />
            Lista
          </button>
        </div>
      </div>

      <DashboardStats
        activeTickets={activeTickets}
        spots={spots}
        apiStatus={apiStatus}
      />

      {viewMode === 'grid' ? (
        <div className='animate-in fade-in zoom-in-95 duration-500'>
          <ParkingMap />
        </div>
      ) : (
        <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <ActiveTicketsTable
            tickets={activeTickets}
            isLoading={isLoadingTickets}
          />
        </div>
      )}
    </div>
  );
}
