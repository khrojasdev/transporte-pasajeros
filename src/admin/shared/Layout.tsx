import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { publicarSitio } from './publicar';

const enlaces = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/calculadora', label: 'Calculadora' },
  { to: '/solicitudes', label: 'Solicitudes' },
  { to: '/viajes', label: 'Viajes' },
  { to: '/vehiculos', label: 'Vehículos' },
  { to: '/conductores', label: 'Conductores' },
  { to: '/peajes', label: 'Peajes' },
  { to: '/configuracion', label: 'Configuración' },
  { to: '/publicaciones', label: 'Ofertas y eventos' },
];

export default function Layout({ onSalir }: { onSalir: () => void }) {
  const [publicando, setPublicando] = useState(false);
  const [msg, setMsg] = useState('');

  const publicar = async () => {
    setMsg('');
    setPublicando(true);
    try {
      await publicarSitio();
      setMsg('Publicación iniciada. El sitio se actualiza en 1-2 minutos.');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error al publicar');
    } finally {
      setPublicando(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside className="flex w-56 shrink-0 flex-col border-r border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-6 font-bold text-amber-400">Panel · ValpoTrips</div>
        <nav className="flex flex-1 flex-col gap-1">
          {enlaces.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.end}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm ${isActive ? 'bg-amber-500 font-semibold text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`
              }
            >
              {e.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 space-y-2">
          <button
            onClick={publicar}
            disabled={publicando}
            className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {publicando ? 'Publicando…' : 'Publicar cambios en el sitio'}
          </button>
          {msg && <p className="text-xs text-slate-400">{msg}</p>}
          <button onClick={onSalir} className="w-full rounded px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800">
            Salir
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}