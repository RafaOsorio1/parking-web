import { useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Calculator,
  CircleDollarSign,
  History,
  Lock,
  TrendingUp,
  Unlock,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { Modal } from '../components/Modal';
import {
  useCashHistory,
  useCashSession,
  useCloseCash,
  useOpenCash,
} from '../hooks/useCash';

export function CashManagement() {
  const [initialAmount, setInitialAmount] = useState<string>('');
  const [actualAmount, setActualAmount] = useState<string>('');
  const [operatorName, setOperatorName] = useState('');
  const [notes, setNotes] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const queryClient = useQueryClient();
  const { data: sessionResponse, isLoading } = useCashSession();
  const { data: historyResponse } = useCashHistory();
  const openMutation = useOpenCash();
  const closeMutation = useCloseCash();

  const session = sessionResponse?.data;
  const history = historyResponse?.data || [];

  const handleOpen = () => {
    const amount = parseFloat(initialAmount);
    if (isNaN(amount) || !operatorName) return;

    openMutation.mutate(
      { initialAmount: amount, notes, openedByName: operatorName },
      {
        onSuccess: () => {
          setInitialAmount('');
          setNotes('');
          setOperatorName('');
          queryClient.invalidateQueries({ queryKey: ['cash-session'] });
        },
      },
    );
  };

  const handleClose = () => {
    const amount = parseFloat(actualAmount);
    if (isNaN(amount) || !operatorName) return;

    closeMutation.mutate(
      { actualAmount: amount, notes, closedByName: operatorName },
      {
        onSuccess: () => {
          setActualAmount('');
          setNotes('');
          setOperatorName('');
          setShowConfirmClose(false);
          queryClient.invalidateQueries({ queryKey: ['cash-session'] });
        },
      },
    );
  };

  if (isLoading)
    return (
      <div className='p-8 text-center text-slate-400'>
        Cargando estado de caja...
      </div>
    );

  return (
    <div className='space-y-12 max-w-5xl mx-auto pb-12'>
      <div>
        <h1 className='text-3xl font-bold flex items-center gap-3 text-white'>
          <Banknote size={32} className='text-emerald-500' />
          Arqueo de Caja
        </h1>
        <p className='text-slate-400 mt-2'>
          Gestiona la apertura y cierre de turnos de operación.
        </p>
      </div>

      {!session ? (
        /* APERTURA DE CAJA */
        <div className='bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <div className='flex flex-col items-center text-center space-y-4'>
            <div className='bg-emerald-500/10 p-6 rounded-full border border-emerald-500/20'>
              <Unlock size={48} className='text-emerald-500' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold text-white'>
                Abrir Nueva Caja
              </h2>
              <p className='text-slate-400'>
                Ingresa el monto base y el nombre del responsable para iniciar.
              </p>
            </div>
          </div>

          <div className='max-w-md mx-auto space-y-6'>
            <div className='space-y-3'>
              <label className='text-sm font-bold text-slate-400 uppercase tracking-widest ml-1'>
                Responsable del Turno
              </label>
              <div className='relative'>
                <User
                  className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-500'
                  size={20}
                />
                <input
                  type='text'
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder='Nombre del operador'
                  className='w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              </div>
            </div>

            <div className='space-y-3'>
              <label className='text-sm font-bold text-slate-400 uppercase tracking-widest ml-1'>
                Base Inicial (COP)
              </label>
              <div className='relative'>
                <CircleDollarSign
                  className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-500'
                  size={24}
                />
                <input
                  type='number'
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder='0'
                  className='w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-6 py-5 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-800 transition-all'
                />
              </div>
            </div>

            <button
              onClick={handleOpen}
              disabled={
                openMutation.isPending || !initialAmount || !operatorName
              }
              className='w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-10 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 text-white flex items-center justify-center gap-3'
            >
              {openMutation.isPending ? 'Abriendo...' : 'Abrir Caja de Turno'}
            </button>
          </div>
        </div>
      ) : (
        /* ESTADO ACTUAL Y CIERRE */
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500'>
          <div className='lg:col-span-2 space-y-8'>
            <div className='bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden'>
              <div className='bg-emerald-500/10 p-8 border-b border-slate-800 flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                  <div className='bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20'>
                    <History size={24} className='text-white' />
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-white'>
                      Turno en Curso
                    </h2>
                    <p className='text-emerald-500 text-sm font-bold flex items-center gap-1 uppercase tracking-widest'>
                      <Unlock size={12} /> {session.openedByName || 'Abierta'}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-xs font-bold text-slate-500 uppercase'>
                    Iniciado el
                  </p>
                  <p className='text-white font-medium'>
                    {new Date(session.openingTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2'>
                  <p className='text-sm font-bold text-slate-500 uppercase flex items-center gap-2'>
                    <CircleDollarSign size={16} /> Base Inicial
                  </p>
                  <p className='text-3xl font-black text-white'>
                    ${session.initialAmount.toLocaleString()}
                  </p>
                </div>
                <div className='bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2'>
                  <p className='text-sm font-bold text-slate-500 uppercase flex items-center gap-2'>
                    <Calculator size={16} /> Ventas del Turno
                  </p>
                  <p className='text-3xl font-black text-blue-400'>
                    +$
                    {(
                      (session.currentExpected || 0) - session.initialAmount
                    ).toLocaleString()}
                  </p>
                </div>
                <div className='md:col-span-2 bg-emerald-500/5 p-8 rounded-2xl border border-emerald-500/10 text-center space-y-2'>
                  <p className='text-sm font-bold text-emerald-500/60 uppercase tracking-[0.2em]'>
                    Total Esperado en Caja
                  </p>
                  <p className='text-6xl font-black text-white tracking-tighter'>
                    ${(session.currentExpected || 0).toLocaleString()}
                    <span className='text-xl text-slate-500 ml-2'>COP</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DE CIERRE */}
          <div className='bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl h-fit sticky top-8 space-y-6'>
            <div className='flex items-center gap-3 pb-4 border-b border-slate-800'>
              <Lock size={24} className='text-red-500' />
              <h3 className='text-xl font-bold text-white'>Cerrar Turno</h3>
            </div>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-400 uppercase tracking-widest ml-1'>
                  Efectivo Contado
                </label>
                <div className='relative'>
                  <CircleDollarSign
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                    size={20}
                  />
                  <input
                    type='number'
                    value={actualAmount}
                    onChange={(e) => setActualAmount(e.target.value)}
                    placeholder='Monto físico'
                    className='w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xl font-bold focus:ring-2 focus:ring-red-500 outline-none text-white'
                  />
                </div>
              </div>

              <button
                onClick={() => setShowConfirmClose(true)}
                disabled={!actualAmount}
                className='w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-900/20 transition-all active:scale-95 text-white'
              >
                Cerrar Operación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORIAL DE CIERRES */}
      <section className='space-y-6'>
        <div className='flex items-center gap-3 border-b border-slate-800 pb-4'>
          <TrendingUp className='text-blue-500' size={24} />
          <h2 className='text-2xl font-bold text-white'>Historial de Turnos</h2>
        </div>

        {history.length === 0 ? (
          <div className='bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 text-center'>
            <p className='text-slate-500'>
              No hay cierres registrados todavía.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {history.map((item) => (
              <div
                key={item.id}
                className='bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all group'
              >
                <div className='flex justify-between items-start'>
                  <div className='bg-slate-950 p-3 rounded-xl'>
                    <User size={18} className='text-blue-500' />
                  </div>
                  <div className='text-right'>
                    <p className='text-xs font-bold text-slate-500 uppercase'>
                      Cerrado por
                    </p>
                    <p className='text-sm text-white font-bold truncate max-w-[120px]'>
                      {item.closedByName || 'S/N'}
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <p className='text-xs text-slate-500 font-medium'>
                    {new Date(item.openingTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -
                    {new Date(item.closingTime!).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-slate-400'>Ventas</span>
                    <span className='font-bold text-white'>
                      ${item.totalIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-slate-400'>Diferencia</span>
                    <span
                      className={`flex items-center gap-1 font-bold ${
                        (item.difference || 0) >= 0
                          ? 'text-emerald-500'
                          : 'text-red-500'
                      }`}
                    >
                      ${(item.difference || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className='pt-4 border-t border-slate-800/50 flex items-center justify-between'>
                  <span className='text-[10px] font-black text-slate-700 uppercase tracking-widest'>
                    Responsable: {item.openedByName}
                  </span>
                  <span className='text-[10px] font-black text-slate-700 uppercase tracking-widest'>
                    {item.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal de Confirmación de Cierre */}
      <Modal
        isOpen={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        title='¿Quién cierra la caja?'
        subtitle='Ingresa tu nombre para finalizar el turno.'
        variant='red'
        icon={<AlertCircle size={32} className='text-white' />}
        footer={
          <div className='grid grid-cols-2 gap-4'>
            <button
              onClick={() => setShowConfirmClose(false)}
              className='w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl'
            >
              Cancelar
            </button>
            <button
              onClick={handleClose}
              disabled={!operatorName}
              className='w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-900/20'
            >
              Cerrar Turno
            </button>
          </div>
        }
      >
        <div className='space-y-6'>
          <div className='space-y-3'>
            <label className='text-sm font-bold text-slate-400 uppercase tracking-widest ml-1'>
              Nombre del Responsable
            </label>
            <input
              type='text'
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder='Tu nombre'
              className='w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-red-500 outline-none'
            />
          </div>

          <div className='p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3'>
            <div className='flex justify-between items-center text-slate-400'>
              <span>Esperado:</span>
              <span className='text-white font-bold'>
                ${session?.currentExpected?.toLocaleString()}
              </span>
            </div>
            <div className='flex justify-between items-center text-slate-400'>
              <span>Contado:</span>
              <span className='text-white font-bold'>
                ${parseFloat(actualAmount).toLocaleString()}
              </span>
            </div>
            <div className='pt-3 border-t border-slate-800 flex justify-between items-center'>
              <span className='font-bold'>Diferencia:</span>
              <span
                className={`text-xl font-black ${
                  parseFloat(actualAmount) - (session?.currentExpected || 0) >=
                  0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }`}
              >
                $
                {(
                  parseFloat(actualAmount) - (session?.currentExpected || 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
