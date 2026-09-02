import { useState } from 'react';
import { Lock, Mail, Car, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      await router.invalidate();
      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Glow effects */}
      <div className='absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none' />

      <div className='w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-8'>
        <div className='text-center space-y-3'>
          <div className='inline-flex p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 mb-2'>
            <Car size={36} />
          </div>
          <h1 className='text-3xl font-black text-white tracking-tight'>ParkingPro</h1>
          <p className='text-sm text-slate-400'>
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        {error && (
          <div className='bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in'>
            <AlertCircle size={18} className='shrink-0' />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <label className='text-xs font-bold text-slate-400 uppercase tracking-widest ml-1'>
              Correo Electrónico
            </label>
            <div className='relative'>
              <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' size={18} />
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='admin@parking.com'
                className='w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-bold text-slate-400 uppercase tracking-widest ml-1'>
              Contraseña
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' size={18} />
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                className='w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isSubmitting || !email || !password}
            className='w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 active:scale-95 text-base mt-2'
          >
            {isSubmitting ? (
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className='text-center pt-2'>
          <p className='text-xs text-slate-600'>
            Sistema de Gestión y Control de Parqueaderos
          </p>
        </div>
      </div>
    </div>
  );
}
