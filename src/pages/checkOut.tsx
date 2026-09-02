import { LogOut, Search, Ticket as TicketIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';

import { ActiveTicketsTable } from '../components/ActiveTicketsTable';
import { Modal } from '../components/Modal';
import { TicketSummary } from '../components/TicketSummary';
import { useActiveTickets, useCheckOut } from '../hooks/useParking';
import type { Ticket } from '../types/parking';

export function CheckOut() {
  const search: any = useSearch({ strict: false });
  const [plate, setPlate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [completedTicket, setCompletedTicket] = useState<Ticket | null>(null);

  const { data: ticketsResponse, isLoading } = useActiveTickets();
  const checkOutMutation = useCheckOut();

  const activeTickets = ticketsResponse?.data || [];

  // Efecto para procesar placa desde URL (procedente del Mapa)
  useEffect(() => {
    const plateFromUrl = search?.plate;
    if (plateFromUrl) {
      setPlate(plateFromUrl);
      // Opcional: Procesar automáticamente si viene de la URL
      handleCheckOut(plateFromUrl);
    }
  }, [search]);

  const handleCheckOut = (target: string | Ticket) => {
    const plateToProcess =
      typeof target === 'string' ? target : target.vehicle?.plate;
    if (!plateToProcess) return;

    checkOutMutation.mutate(plateToProcess.toUpperCase(), {
      onSuccess: (response: any) => {
        setCompletedTicket(response.data);
        setShowModal(true);
        setPlate('');
      },
      onError: (error) => alert(error.message),
    });
  };

  return (
    <div className='space-y-8 max-w-5xl mx-auto pb-12 relative'>
      <div>
        <h1 className='text-3xl font-bold flex items-center gap-3 text-white'>
          <LogOut size={32} className='text-red-500' />
          Registrar Salida
        </h1>
        <p className='text-slate-400 mt-2'>
          Procesa el pago y libera el espacio de parqueo.
        </p>
      </div>

      <div className='bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6'>
        <div className='space-y-3'>
          <label className='text-sm font-bold text-slate-400 uppercase tracking-widest ml-1'>
            Buscar por Placa
          </label>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search
                className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-500'
                size={20}
              />
              <input
                type='text'
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder='ABC123'
                className='w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-6 py-5 text-2xl font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder-slate-800 transition-all'
              />
            </div>
            <button
              onClick={() => handleCheckOut(plate)}
              disabled={checkOutMutation.isPending || !plate}
              className='bg-red-600 hover:bg-red-500 disabled:opacity-50 px-10 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-red-900/20 transition-all active:scale-95 text-white flex items-center justify-center gap-3'
            >
              {checkOutMutation.isPending ? (
                <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              ) : (
                <>
                  <TicketIcon size={24} />
                  Procesar Salida
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-white'>
            Vehículos esperando salida
          </h2>
          <span className='bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter'>
            {activeTickets.length} Activos
          </span>
        </div>
        <ActiveTicketsTable
          tickets={activeTickets}
          isLoading={isLoading}
          onCheckOut={(ticket) => handleCheckOut(ticket)}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='¡Salida Exitosa!'
        subtitle={`Ticket #${completedTicket?.id.slice(0, 8)}`}
        variant='emerald'
        footer={
          <button
            onClick={() => setShowModal(false)}
            className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 text-lg'
          >
            Confirmar Pago y Cerrar
          </button>
        }
      >
        {completedTicket && (
          <TicketSummary ticket={completedTicket} showExitTime showFee />
        )}
      </Modal>
    </div>
  );
}
