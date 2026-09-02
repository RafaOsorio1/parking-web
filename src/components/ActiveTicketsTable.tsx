import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Bike, Car, LogOut } from 'lucide-react';

import { useCheckOut } from '../hooks/useParking';
import type { Ticket } from '../types/parking';

interface ActiveTicketsTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  onCheckOut?: (ticket: Ticket) => void;
}

export function ActiveTicketsTable({
  tickets,
  isLoading,
  onCheckOut,
}: ActiveTicketsTableProps) {
  const checkOutMutation = useCheckOut();
  const columnHelper = createColumnHelper<Ticket>();

  const columns = [
    columnHelper.accessor('vehicle.plate', {
      header: 'Placa',
      cell: (info) => (
        <span className='font-mono text-lg font-bold'>{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('vehicle.type', {
      header: 'Tipo',
      cell: (info) => (
        <span className='flex items-center gap-2'>
          {info.getValue() === 'CAR' ? <Car size={16} /> : <Bike size={16} />}
          {info.getValue() === 'CAR' ? 'Carro' : 'Moto'}
        </span>
      ),
    }),
    columnHelper.accessor('entryTime', {
      header: 'Hora Entrada',
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.accessor('spot.number', {
      header: 'Espacio',
      cell: (info) => (
        <span className='font-bold text-blue-400'>{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: (info) => (
        <button
          onClick={() => {
            if (onCheckOut) {
              onCheckOut(info.row.original);
              return;
            }
            if (info.row.original.vehicle) {
              checkOutMutation.mutate(info.row.original.vehicle.plate, {
                onError: (error) => alert(error.message),
              });
            }
          }}
          disabled={checkOutMutation.isPending}
          className='flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50'
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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='space-y-4 pt-4'>
      <h2 className='text-xl font-bold text-white flex items-center gap-2'>
        Vehículos en Parqueadero
        <span className='bg-slate-800 text-slate-300 text-sm py-1 px-3 rounded-full font-medium'>
          {tickets.length}
        </span>
      </h2>

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
                      className='p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider'
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
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className='p-8 text-center text-slate-500'
                  >
                    No hay vehículos registrados en este momento.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className='hover:bg-slate-800/50 transition-colors text-slate-300 group'
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
    </div>
  );
}
