import {
  Accessibility,
  Bike,
  Calendar,
  Car,
  Check,
  DollarSign,
  Edit2,
  Key,
  Mail,
  Plus,
  Save,
  Settings as SettingsIcon,
  Shield,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { Modal } from '../components/Modal';
import { useCreateSpot, useSpots } from '../hooks/useParking';
import { useRates } from '../hooks/useRates';
import { useUsers } from '../hooks/useUsers';
import type { Rate } from '../types/parking';

export function Settings() {
  const search: any = useSearch({ strict: false });
  const navigate = useNavigate();

  const activeTab = search?.tab === 'operators' ? 'operators' : 'general';

  const setTab = (tab: 'general' | 'operators') => {
    navigate({
      to: '/settings',
      search: { tab },
    });
  };

  // Rates & Spots state
  const {
    rates,
    isLoading: isLoadingRates,
    updateRate,
    createRate,
  } = useRates();
  const query = useSpots();
  const createSpotMutation = useCreateSpot();

  const spots = query.data || [];

  const [spotConfig, setSpotConfig] = useState({
    type: 'CAR' as 'CAR' | 'MOTORCYCLE',
    count: 10,
    prefix: 'C',
    isAccessible: false,
  });

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

  // Operators state
  const { users, isLoading: isLoadingUsers, createUser, isCreating: isCreatingUser } = useUsers();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'OPERATOR' as 'ADMIN' | 'OPERATOR',
  });
  const [userError, setUserError] = useState<string | null>(null);

  const handleGenerateSpots = () => {
    createSpotMutation.mutate({
      type: spotConfig.type,
      count: spotConfig.count,
      isAccessible: spotConfig.isAccessible,
    });
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError(null);
    try {
      await createUser(newUserData);
      setIsCreateUserModalOpen(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        role: 'OPERATOR',
      });
    } catch (err: any) {
      setUserError(err.message || 'Error al registrar usuario');
    }
  };

  const carSpots = spots.filter((s) => s.type === 'CAR');
  const bikeSpots = spots.filter((s) => s.type === 'MOTORCYCLE');
  const accessibleSpots = spots.filter((s: any) => s.isAccessible);

  return (
    <div className='space-y-10 pb-12'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold flex items-center gap-3'>
          <SettingsIcon size={32} className='text-blue-500' />
          Configuración del Sistema
        </h1>
        <p className='text-slate-400 mt-2'>
          Administra los espacios, tarifas del parqueadero y las cuentas del personal.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className='flex gap-2 border-b border-slate-800 pb-1'>
        <button
          onClick={() => setTab('general')}
          className={`flex items-center gap-2 px-6 py-3 font-bold rounded-2xl text-sm transition-all ${
            activeTab === 'general'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Car size={18} />
          Espacios y Tarifas
        </button>
        <button
          onClick={() => setTab('operators')}
          className={`flex items-center gap-2 px-6 py-3 font-bold rounded-2xl text-sm transition-all ${
            activeTab === 'operators'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users size={18} />
          Personal y Operadores
        </button>
      </div>

      {/* TAB 1: ESPACIOS Y TARIFAS */}
      {activeTab === 'general' && (
        <div className='space-y-12 animate-in fade-in'>
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
                <div>
                  <label className='flex items-center gap-3 cursor-pointer p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors'>
                    <input
                      type='checkbox'
                      checked={spotConfig.isAccessible}
                      onChange={(e) =>
                        setSpotConfig({
                          ...spotConfig,
                          isAccessible: e.target.checked,
                        })
                      }
                      className='w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500'
                    />
                    <div className='flex items-center gap-2'>
                      <Accessibility size={18} className='text-blue-400' />
                      <span className='text-sm font-semibold text-slate-200'>
                        Espacios Accesibles (PMR ♿)
                      </span>
                    </div>
                  </label>
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

              <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center shadow-xl'>
                  <Car size={40} className='text-blue-500 mb-4 opacity-80' />
                  <h4 className='text-4xl font-black text-white'>
                    {query.isLoading ? '-' : carSpots.length}
                  </h4>
                  <p className='text-slate-400 mt-2 font-medium text-sm'>
                    Espacios de Carro
                  </p>
                </div>
                <div className='bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center shadow-xl'>
                  <Bike size={40} className='text-purple-500 mb-4 opacity-80' />
                  <h4 className='text-4xl font-black text-white'>
                    {query.isLoading ? '-' : bikeSpots.length}
                  </h4>
                  <p className='text-slate-400 mt-2 font-medium text-sm'>
                    Espacios de Moto
                  </p>
                </div>
                <div className='bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center shadow-xl'>
                  <Accessibility size={40} className='text-blue-400 mb-4 opacity-80' />
                  <h4 className='text-4xl font-black text-white'>
                    {query.isLoading ? '-' : accessibleSpots.length}
                  </h4>
                  <p className='text-slate-400 mt-2 font-medium text-sm'>
                    Espacios PMR ♿
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
        </div>
      )}

      {/* TAB 2: OPERADORES Y PERSONAL */}
      {activeTab === 'operators' && (
        <section className='space-y-6 animate-in fade-in'>
          <div className='flex justify-between items-center border-b border-slate-800 pb-4'>
            <div>
              <h2 className='text-2xl font-bold text-white'>Cuentas de Operadores</h2>
              <p className='text-sm text-slate-400 mt-1'>
                Personal habilitado para operar turnos y registrar movimientos.
              </p>
            </div>
            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className='bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all'
            >
              <UserPlus size={18} />
              Nuevo Operador
            </button>
          </div>

          {isLoadingUsers ? (
            <p className='text-slate-500'>Cargando operadores...</p>
          ) : users.length === 0 ? (
            <div className='text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3'>
              <Users size={40} className='mx-auto text-slate-600' />
              <p className='text-slate-400 font-medium'>No hay operadores registrados</p>
              <button
                onClick={() => setIsCreateUserModalOpen(true)}
                className='text-blue-400 hover:underline text-sm font-bold'
              >
                Crear el primer operador
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {users.map((u) => (
                <div
                  key={u.id}
                  className='bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 group hover:border-slate-700 transition-all'
                >
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <div className='p-3 bg-blue-600/10 text-blue-400 rounded-2xl'>
                        {u.role === 'ADMIN' ? <Shield size={22} /> : <User size={22} />}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {u.role === 'ADMIN' ? 'Administrador' : 'Operador'}
                      </span>
                    </div>

                    <div>
                      <h3 className='text-xl font-bold text-white'>{u.name}</h3>
                      <p className='text-sm text-slate-400 flex items-center gap-1.5 mt-1'>
                        <Mail size={14} className='text-slate-500' />
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className='pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500'>
                    <span>Habilitado</span>
                    <span className='flex items-center gap-1 text-emerald-400 font-bold'>
                      <UserCheck size={14} /> Activo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

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

      {/* Modal para Crear Operador */}
      <Modal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        title='Nuevo Personal / Operador'
        subtitle='Crea una cuenta para que un empleado opere el sistema'
        variant='blue'
        footer={
          <button
            type='submit'
            form='create-operator-form'
            disabled={isCreatingUser || !newUserData.name || !newUserData.email || !newUserData.password}
            className='w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95'
          >
            {isCreatingUser ? 'Registrando...' : 'Registrar Operador'}
          </button>
        }
      >
        <form id='create-operator-form' onSubmit={handleCreateUser} className='space-y-4'>
          {userError && (
            <div className='p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs'>
              {userError}
            </div>
          )}

          <div>
            <label className='text-xs text-slate-500 uppercase font-bold ml-1'>
              Nombre Completo
            </label>
            <div className='relative mt-1'>
              <User size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
              <input
                required
                className='w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                placeholder='Ej: Carlos Pérez'
                value={newUserData.name}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className='text-xs text-slate-500 uppercase font-bold ml-1'>
              Correo Electrónico
            </label>
            <div className='relative mt-1'>
              <Mail size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
              <input
                type='email'
                required
                className='w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                placeholder='carlos@parking.com'
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className='text-xs text-slate-500 uppercase font-bold ml-1'>
              Contraseña Temporal
            </label>
            <div className='relative mt-1'>
              <Key size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
              <input
                type='password'
                required
                minLength={6}
                className='w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                placeholder='Mínimo 6 caracteres'
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className='text-xs text-slate-500 uppercase font-bold ml-1'>
              Rol en el Sistema
            </label>
            <select
              className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none mt-1 focus:ring-2 focus:ring-blue-500 text-sm'
              value={newUserData.role}
              onChange={(e) =>
                setNewUserData({
                  ...newUserData,
                  role: e.target.value as 'ADMIN' | 'OPERATOR',
                })
              }
            >
              <option value='OPERATOR'>Operador (Caja, Entradas y Salidas)</option>
              <option value='ADMIN'>Administrador (Acceso Total)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
