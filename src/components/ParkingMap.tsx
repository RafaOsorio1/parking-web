import { Accessibility, ArrowRight, Bike, Car, Clock, Info } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

import { useOccupancyMap } from '../hooks/useParking';

export function ParkingMap() {
  const { data: spotsResponse, isLoading } = useOccupancyMap();
  const navigate = useNavigate();

  const spots = spotsResponse?.data || [];

  // Agrupar por prefijo (primera letra del número de espacio)
  const groupedSpots = spots.reduce((acc: Record<string, any[]>, spot: any) => {
    const prefix = spot.number.match(/^[A-Z]+/)?.[0] || '#';
    if (!acc[prefix]) acc[prefix] = [];
    acc[prefix].push(spot);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse'>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className='h-32 bg-slate-900 rounded-2xl border border-slate-800'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-12'>
      {Object.entries(groupedSpots).map(([prefix, spotsInSection]) => (
        <section key={prefix} className='space-y-6'>
          <div className='flex items-center gap-3 border-b border-slate-800 pb-4'>
            <div className='bg-slate-800 px-3 py-1 rounded-lg text-blue-400 font-black text-sm'>
              SECCIÓN {prefix}
            </div>
            <h2 className='text-slate-500 text-sm font-bold uppercase tracking-widest'>
              {(spotsInSection as any[]).length} ESPACIOS TOTALES
            </h2>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
            {(spotsInSection as any[]).map((spot: any) => {
              const activeTicket = spot.tickets?.[0];
              const isOccupied = !!activeTicket;

              return (
                <div
                  key={spot.id}
                  onClick={() => {
                    if (isOccupied) {
                      navigate({
                        to: '/salida',
                        search: { plate: activeTicket.vehicle.plate },
                      });
                    } else {
                      navigate({
                        to: '/entrada',
                        search: { spot: spot.number },
                      });
                    }
                  }}
                  className={`relative group cursor-pointer h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden ${
                    isOccupied
                      ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10'
                      : spot.isAccessible
                      ? 'bg-blue-950/30 border-blue-500/40 hover:border-blue-400 hover:bg-blue-900/20 ring-1 ring-blue-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                  }`}
                >
                  {/* Numero de espacio */}
                  <span
                    className={`absolute top-2 left-3 text-[10px] font-black uppercase tracking-tighter ${
                      isOccupied
                        ? 'text-red-500/50'
                        : spot.isAccessible
                        ? 'text-blue-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {spot.number}
                  </span>

                  {/* Badge Accesible PMR */}
                  {spot.isAccessible && (
                    <span
                      title='Espacio Accesible (PMR ♿)'
                      className={`absolute top-2 right-2.5 p-1 rounded-md text-[10px] flex items-center justify-center ${
                        isOccupied
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40'
                      }`}
                    >
                      <Accessibility size={12} />
                    </span>
                  )}

                  {/* Icono de Vehiculo */}
                  <div
                    className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${
                      isOccupied
                        ? 'bg-red-500/10 text-red-500'
                        : 'text-slate-700'
                    }`}
                  >
                    {spot.type === 'CAR' ? (
                      <Car size={24} />
                    ) : (
                      <Bike size={24} />
                    )}
                  </div>

                  {/* Info de Ocupacion */}
                  {isOccupied ? (
                    <div className='text-center animate-in fade-in slide-in-from-bottom-2 duration-300'>
                      <p className='text-sm font-black text-white font-mono tracking-tight'>
                        {activeTicket.vehicle.plate}
                      </p>
                      <div className='flex items-center justify-center gap-1 text-[10px] text-red-500/70 font-bold uppercase'>
                        <Clock size={10} />
                        {new Date(activeTicket.entryTime).toLocaleTimeString(
                          [],
                          { hour: '2-digit', minute: '2-digit' },
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <span className='text-[10px] font-black text-emerald-500 uppercase tracking-widest'>
                        Libre
                      </span>
                      <ArrowRight size={10} className='text-emerald-500' />
                    </div>
                  )}

                  {/* Indicador de Status */}
                  <div
                    className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                      isOccupied
                        ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                        : 'bg-slate-800'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Leyenda */}
      <div className='bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500'>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 rounded-full bg-slate-800' />
          <span>Disponible</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' />
          <span>Ocupado</span>
        </div>
        <div className='flex items-center gap-2 text-blue-400'>
          <Info size={14} />
          <span>Click para cobrar o registrar</span>
        </div>
      </div>
    </div>
  );
}
