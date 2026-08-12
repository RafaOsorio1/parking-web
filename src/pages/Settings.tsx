import {
  Bike,
  Calendar,
  Car,
  Check,
  DollarSign,
  Edit2,
  Plus,
  Save,
  Settings as SettingsIcon,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { Modal } from '../components/Modal';
import { useCreateSpot, useSpots } from '../hooks/useParking';
import { useRates } from '../hooks/useRates';
import type { Rate } from '../types/parking';

export function Settings() {
  const {
    rates,
    isLoading: isLoadingRates,
    updateRate,
    createRate,
  } = useRates();
  const {
    data: spotsResponse,
    isLoading: isLoadingSpots,
    refetch: refetchSpots,
  } = useSpots();
  const createSpotMutation = useCreateSpot();

  const spots = spotsResponse?.data || [];

  const [spotConfig, setSpotConfig] = useState({
    type: 'CAR' as 'CAR' | 'MOTORCYCLE',
    count: 10,
    prefix: 'C',
  });

  // Estado para edición de tarifas
  const [editingRate, setEditingRate] = useState<Rate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRateData, setNewRateData] = useState({
    name: '',
    vehicleType: 'CAR' as 'CAR' | 'MOTORCYCLE',
    baseFee: 0,
    baseTimeMinutes: 30,
    hourlyRate: 0,
    dailyMax: 0,
  });

  const handleGenerateSpots = async () => {
    if (spotConfig.count <= 0) return;
    const existingSpots = spots.filter(
      (s) => s.type === spotConfig.type,
    ).length;
    let successCount = 0;
    for (let i = 1; i <= spotConfig.count; i++) {
      const number = `${spotConfig.prefix}${existingSpots + i}`;
      try {
        await createSpotMutation.mutateAsync({ number, type: spotConfig.type });
        successCount++;
      } catch (e) {
        console.error('Error creating spot', e);
      }
    }
    alert(`Se crearon ${successCount} espacios exitosamente.`);
    refetchSpots();
  };

  const handleUpdateRate = () => {
    if (!editingRate) return;
    updateRate(
      {
        id: editingRate.id,
        name: editingRate.name,
        baseFee: editingRate.baseFee,
        baseTimeMinutes: editingRate.baseTimeMinutes,
        hourlyRate: editingRate.hourlyRate,
        dailyMax: editingRate.dailyMax || undefined,
      },
      {
        onSuccess: () => setEditingRate(null),
      },
    );
  };

  const handleActivateRate = (id: string) => {
    updateRate({ id, isActive: true });
  };

  const handleCreateRate = () => {
    createRate(newRateData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setNewRateData({
          name: '',
          vehicleType: 'CAR',
          baseFee: 0,
          baseTimeMinutes: 30,
          hourlyRate: 0,
          dailyMax: 0,
        });
      },
    });
  };

  const carSpots = spots.filter((s) => s.type === 'CAR');
  const bikeSpots = spots.filter((s) => s.type === 'MOTORCYCLE');

  return (
    <div className='space-y-12 pb-12'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold flex items-center gap-3'>
          <SettingsIcon size={32} className='text-blue-500' />
          Configuración del Sistema
        </h1>
        <p className='text-slate-400 mt-2'>
          Administra las tarifas y los espacios físicos del parqueadero.
        </p>
      </div>

      {/* Spots Section */}
      <section className='space-y-6'>
        <div className='flex justify-between items-center border-b border-slate-800 pb-4'>
          <h2 className='text-2xl font-bold text-white'>Gestión de Espacios</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-1 space-y-4 shadow-xl'>
            <h3 className='text-lg font-semibold text-slate-300'>
              Generar Lote
            </h3>
            <div>
              <label className='text-sm text-slate-400 block mb-2'>Tipo</label>
              <select
                className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none'
                value={spotConfig.type}
                onChange={(e) =>
                  setSpotConfig({
                    ...spotConfig,
                    type: e.target.value as 'CAR' | 'MOTORCYCLE',
                  })
                }
              >
                <option value='CAR'>Carro</option>
                <option value='MOTORCYCLE'>Moto</option>
              </select>
            </div>
            <div>
              <label className='text-sm text-slate-400 block mb-2'>
                Cantidad
              </label>
              <input
                type='number'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none'
                value={spotConfig.count}
                onChange={(e) =>
                  setSpotConfig({
                    ...spotConfig,
                    count: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <button
              onClick={handleGenerateSpots}
              disabled={createSpotMutation.isPending}
              className='w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-4'
            >
              <Plus size={20} />
              Crear Espacios
            </button>
          </div>

          <div className='md:col-span-2 grid grid-cols-2 gap-6'>
            <div className='bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center shadow-xl'>
              <Car size={48} className='text-blue-500 mb-4 opacity-80' />
              <h4 className='text-5xl font-black text-white'>
                {isLoadingSpots ? '-' : carSpots.length}
              </h4>
              <p className='text-slate-400 mt-2 font-medium'>
                Espacios de Carro
              </p>
            </div>
            <div className='bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center shadow-xl'>
              <Bike size={48} className='text-purple-500 mb-4 opacity-80' />
              <h4 className='text-5xl font-black text-white'>
                {isLoadingSpots ? '-' : bikeSpots.length}
              </h4>
              <p className='text-slate-400 mt-2 font-medium'>
                Espacios de Moto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rates Section */}
      <section className='space-y-6'>
        <div className='flex justify-between items-center border-b border-slate-800 pb-4'>
          <h2 className='text-2xl font-bold text-white'>Gestión de Tarifas</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all'
          >
            <Plus size={18} />
            Nueva Tarifa
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {isLoadingRates ? (
            <p className='text-slate-500'>Cargando tarifas...</p>
          ) : (
            rates.map((rate) => (
              <div
                key={rate.id}
                className={`p-8 rounded-3xl border transition-all shadow-xl ${
                  rate.isActive
                    ? 'bg-blue-600/5 border-blue-500/30 ring-1 ring-blue-500/20'
                    : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <div className='flex justify-between items-start mb-6'>
                  <div className='p-4 bg-slate-800 rounded-2xl'>
                    {rate.vehicleType === 'CAR' ? (
                      <Car className='text-blue-400' />
                    ) : (
                      <Bike className='text-purple-400' />
                    )}
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      rate.isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {rate.isActive ? 'Vigente' : 'Inactiva'}
                  </span>
                </div>

                {editingRate?.id === rate.id ? (
                  <div className='space-y-4 animate-in fade-in zoom-in-95'>
                    <input
                      className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-bold text-xl focus:ring-2 focus:ring-blue-500 outline-none'
                      value={editingRate.name}
                      onChange={(e) =>
                        setEditingRate({ ...editingRate, name: e.target.value })
                      }
                    />
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='text-xs text-slate-500 uppercase font-bold'>
                          Por Hora
                        </label>
                        <input
                          type='number'
                          className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none'
                          value={editingRate.hourlyRate}
                          onChange={(e) =>
                            setEditingRate({
                              ...editingRate,
                              hourlyRate: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className='text-xs text-slate-500 uppercase font-bold'>
                          Base (Fracción)
                        </label>
                        <input
                          type='number'
                          className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none'
                          value={editingRate.baseFee}
                          onChange={(e) =>
                            setEditingRate({
                              ...editingRate,
                              baseFee: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={handleUpdateRate}
                        className='flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2'
                      >
                        <Save size={18} /> Guardar
                      </button>
                      <button
                        onClick={() => setEditingRate(null)}
                        className='flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2'
                      >
                        <X size={18} /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className='text-2xl font-bold mb-2 text-white'>
                      {rate.name}
                    </h2>
                    <div className='space-y-4 mt-6'>
                      <div className='flex items-center justify-between text-slate-300'>
                        <span className='flex items-center gap-2 text-sm'>
                          <DollarSign size={16} className='text-slate-500' />
                          Tarifa por Hora
                        </span>
                        <span className='text-xl font-mono font-bold text-white'>
                          ${rate.hourlyRate.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex items-center justify-between text-slate-300'>
                        <span className='flex items-center gap-2 text-sm'>
                          <Calendar size={16} className='text-slate-500' />
                          Base
                        </span>
                        <span className='text-white font-medium'>
                          {rate.baseTimeMinutes} min / $
                          {rate.baseFee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className='mt-8 flex gap-3'>
                      <button
                        onClick={() => setEditingRate(rate)}
                        className='flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold flex items-center justify-center gap-2'
                      >
                        <Edit2 size={16} /> Editar
                      </button>
                      {!rate.isActive && (
                        <button
                          onClick={() => handleActivateRate(rate.id)}
                          className='flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2'
                        >
                          <Check size={16} /> Activar
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal para Crear Tarifa */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title='Nueva Tarifa'
        subtitle='Configura una nueva regla de cobro'
        variant='blue'
        footer={
          <button
            onClick={handleCreateRate}
            className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl'
          >
            Crear Tarifa
          </button>
        }
      >
        <div className='space-y-4'>
          <div>
            <label className='text-xs text-slate-500 uppercase font-bold ml-1'>
              Nombre
            </label>
            <input
              className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none'
              placeholder='Ej: Tarifa General Carros'
              value={newRateData.name}
              onChange={(e) =>
                setNewRateData({ ...newRateData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className='text-xs text-slate-500 uppercase font-bold ml-1'>
              Tipo de Vehículo
            </label>
            <select
              className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none'
              value={newRateData.vehicleType}
              onChange={(e) =>
                setNewRateData({
                  ...newRateData,
                  vehicleType: e.target.value as any,
                })
              }
            >
              <option value='CAR'>Carro</option>
              <option value='MOTORCYCLE'>Moto</option>
            </select>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-xs text-slate-500 uppercase font-bold ml-1'>
                Tarifa Hora
              </label>
              <input
                type='number'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none'
                value={newRateData.hourlyRate}
                onChange={(e) =>
                  setNewRateData({
                    ...newRateData,
                    hourlyRate: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className='text-xs text-slate-500 uppercase font-bold ml-1'>
                Base Fracción
              </label>
              <input
                type='number'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none'
                value={newRateData.baseFee}
                onChange={(e) =>
                  setNewRateData({
                    ...newRateData,
                    baseFee: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
