import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertCircle, Bike, Car, LogOut } from 'lucide-react';
import { useState } from 'react';

import { useCheckOut } from '../hooks/useParking';
import type { Ticket } from '../types/parking';
import { Modal } from './Modal';
import { TicketSummary } from './TicketSummary';

interface ActiveTicketsTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  onCheckOut?: (ticket: Ticket) => void;
}

export function ActiveTicketsTable({
  tickets,
  isLoading,
  globalFilter = '',
  onGlobalFilterChange,
  onCheckOut,
}: ActiveTicketsTableProps) {
  const checkOutMutation = useCheckOut();
  const columnHelper = createColumnHelper<Ticket>();

  // Estado para confirmación y modal cuando la tabla se usa de forma autónoma (ej: Dashboard)
  const [ticketToConfirm, setTicketToConfirm] = useState<Ticket | null>(null);
  const [completedTicket, setCompletedTicket] = useState<Ticket | null>(null);

  const handleTriggerCheckOut = (ticket: Ticket) => {
    if (onCheckOut) {
      onCheckOut(ticket);
      return;
    }
    // Si no hay callback externo, abrir confirmación interna
    setTicketToConfirm(ticket);
  };

  const handleConfirmExit = () => {
    if (!ticketToConfirm?.vehicle?.plate) return;

    checkOutMutation.mutate(ticketToConfirm.vehicle.plate, {
      onSuccess: (response: any) => {
        setCompletedTicket(response.data);
        setTicketToConfirm(null);
      },
      onError: (error) => {
        alert(error.message);
        setTicketToConfirm(null);
      },
    });
  };

  const columns = [
    columnHelper.accessor('vehicle.plate', {
      header: 'Placa',
      cell: (info) => (
        <span className='font-mono text-lg font-bold text-white tracking-wider'>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('vehicle.type', {
      header: 'Tipo',
      cell: (info) => (
        <span className='flex items-center gap-2 font-medium'>
          {info.getValue() === 'CAR' ? (
            <Car size={16} className='text-blue-400' />
          ) : (
            <Bike size={16} className='text-purple-400' />
          )}
          {info.getValue() === 'CAR' ? 'Carro' : 'Moto'}
        </span>
      ),
    }),
    columnHelper.accessor('entryTime', {
      header: 'Hora Entrada',
      cell: (info) => new Date(info.getValue()).toLocaleString([], {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    }),
    columnHelper.accessor('spot.number', {
      header: 'Espacio',
      cell: (info) => (
        <span className='font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg'>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: (info) => (
        <button
          onClick={() => handleTriggerCheckOut(info.row.original)}
          disabled={checkOutMutation.isPending}
          className='flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-3.5 py-1.5 rounded-xl transition-all text-sm font-semibold disabled:opacity-50 border border-red-500/20'
        >
          <LogOut size={16} />
          Salida
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: tickets,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rowCount = table.getRowModel().rows.length;

  return (
    <div className='space-y-4 pt-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold text-white flex items-center gap-2'>
          Vehículos en Parqueadero
          <span className='bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full font-bold'>
            {globalFilter ? `${rowCount} de ${tickets.length} encontrados` : `${tickets.length} Activos`}
          </span>
        </h2>
      </div>

      <div className='bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse min-w-[600px]'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className='border-b border-slate-800 bg-slate-950/50'
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className='p-4 text-xs font-bold text-slate-400 uppercase tracking-wider'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className='divide-y divide-slate-800/50'>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className='p-8 text-center text-slate-500'
                  >
                    Cargando vehículos...
                  </td>
                </tr>
              ) : rowCount === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className='p-8 text-center text-slate-500 font-medium'
                  >
                    {globalFilter
                      ? `No se encontraron vehículos que coincidan con "${globalFilter}".`
                      : 'No hay vehículos registrados en este momento.'}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleTriggerCheckOut(row.original)}
                    className='hover:bg-slate-800/60 transition-colors text-slate-300 group cursor-pointer'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className='p-4 whitespace-nowrap'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmación de Salida (autónomo) */}
      <Modal
        isOpen={!!ticketToConfirm}
        onClose={() => setTicketToConfirm(null)}
        title='Confirmar Salida'
        subtitle='¿Deseas procesar la salida y liquidar este ticket?'
        variant='blue'
        footer={
          <div className='grid grid-cols-2 gap-3 w-full'>
            <button
              onClick={() => setTicketToConfirm(null)}
              className='py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all'
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmExit}
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

      {/* Modal de Salida Exitosa con Total a Cobrar (autónomo) */}
      <Modal
        isOpen={!!completedTicket}
        onClose={() => setCompletedTicket(null)}
        title='¡Salida Exitosa!'
        subtitle={`Ticket #${completedTicket?.id.slice(0, 8)}`}
        variant='emerald'
        footer={
          <button
            onClick={() => setCompletedTicket(null)}
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
