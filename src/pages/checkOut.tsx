import { AlertCircle, LogOut, Search, Ticket as TicketIcon } from 'lucide-react';
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
  const [ticketToConfirm, setTicketToConfirm] = useState<Ticket | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedTicket, setCompletedTicket] = useState<Ticket | null>(null);

  const { data: ticketsResponse, isLoading } = useActiveTickets();
  const checkOutMutation = useCheckOut();

  const activeTickets = ticketsResponse?.data || [];

  // Efecto para leer placa desde URL (procedente del Mapa o navegación)
  useEffect(() => {
    const plateFromUrl = search?.plate;
    if (plateFromUrl) {
      setPlate(plateFromUrl);
      const matched = activeTickets.find(
        (t) => t.vehicle?.plate.toUpperCase() === plateFromUrl.toUpperCase(),
      );
      if (matched) {
        setTicketToConfirm(matched);
      }
    }
  }, [search, activeTickets]);

  const [notFoundError, setNotFoundError] = useState<string | null>(null);

  const handleRequestExit = (target: string | Ticket) => {
    setNotFoundError(null);

    if (typeof target === 'object') {
      const targetPlate = target.vehicle?.plate;
      if (!targetPlate) return;
      setPlate(targetPlate);
      setTicketToConfirm(target);
      return;
    }

    const cleanPlate = target.trim().toUpperCase();
    if (!cleanPlate) return;

    // Buscar coincidencia exacta en los tickets activos reales
    const matched = activeTickets.find(
      (t) => t.vehicle?.plate.toUpperCase() === cleanPlate,
    );

    if (matched) {
      setTicketToConfirm(matched);
    } else {
      // Si no existe, no abrir modal. Notificar que el vehículo no está en el parqueadero
      setNotFoundError(
        `No hay ningún vehículo activo en el parqueadero con la placa "${cleanPlate}".`,
      );
    }
  };

  const handleExecuteExit = () => {
    const plateToProcess = ticketToConfirm?.vehicle?.plate || plate;
    if (!plateToProcess) return;

    checkOutMutation.mutate(plateToProcess.toUpperCase(), {
      onSuccess: (response: any) => {
        setCompletedTicket(response.data);
        setTicketToConfirm(null);
        setShowSuccessModal(true);
        setPlate('');
      },
      onError: (error) => {
        alert(error.message);
      },
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
          Busca el vehículo por placa o selecciónalo de la lista para liquidar su tiempo y pago.
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
                onChange={(e) => {
                  setPlate(e.target.value.toUpperCase());
                  setNotFoundError(null);
                }}
                placeholder='Escribe la placa (ej: ABC123)...'
                className='w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-6 py-5 text-2xl font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder-slate-700 transition-all'
              />
            </div>
            <button
              onClick={() => handleRequestExit(plate)}
              disabled={checkOutMutation.isPending || !plate.trim()}
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

          {notFoundError && (
            <div className='flex items-center gap-3 text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl animate-in fade-in'>
              <AlertCircle size={18} className='shrink-0 text-amber-400' />
              <span>{notFoundError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabla con filtrado reactivo de TanStack Table */}
      <div className='space-y-4'>
        <ActiveTicketsTable
          tickets={activeTickets}
          isLoading={isLoading}
          globalFilter={plate}
          onGlobalFilterChange={setPlate}
          onCheckOut={(ticket) => handleRequestExit(ticket)}
        />
      </div>

      {/* Modal 1: Confirmación antes de liquidar */}
      <Modal
        isOpen={!!ticketToConfirm}
        onClose={() => setTicketToConfirm(null)}
        title='Confirmar Salida'
        subtitle={`Vehículo Placa ${ticketToConfirm?.vehicle?.plate}`}
        variant='blue'
        footer={
          <div className='grid grid-cols-2 gap-3 w-full'>
            <button
              type='button'
              onClick={() => setTicketToConfirm(null)}
              className='py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all'
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={handleExecuteExit}
              disabled={checkOutMutation.isPending}
              className='py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2'
            >
              {checkOutMutation.isPending ? 'Liquidando...' : 'Confirmar Salida'}
            </button>
          </div>
        }
      >
        {ticketToConfirm && (
          <div className='space-y-4 text-slate-300'>
            <div className='flex items-center gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800'>
              <AlertCircle className='text-blue-400 shrink-0' size={24} />
              <div className='text-sm'>
                Se calculará la tarifa acumulada según el tiempo de permanencia y se liberará el espacio inmediatamente.
              </div>
            </div>
            <TicketSummary ticket={ticketToConfirm} />
          </div>
        )}
      </Modal>

      {/* Modal 2: Salida Exitosa con Total a Cobrar */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title='¡Salida Exitosa!'
        subtitle={`Ticket #${completedTicket?.id.slice(0, 8)}`}
        variant='emerald'
        footer={
          <button
            type='button'
            onClick={() => setShowSuccessModal(false)}
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
