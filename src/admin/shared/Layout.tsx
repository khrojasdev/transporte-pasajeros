import { NavLink, Outlet } from 'react-router-dom';

const enlaces = [
  { to: '/',              label: 'Dashboard',    end: true },
  { to: '/calculadora',   label: 'Calculadora' },
  { to: '/solicitudes',   label: 'Solicitudes' },
  { to: '/viajes',        label: 'Viajes' },
  { to: '/vehiculos',     label: 'Vehículos' },
  { to: '/peajes',        label: 'Peajes' },
  { to: '/configuracion', label: 'Configuración' },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-6 font-bold text-amber-400">Panel · Transporte</div>
        <nav className="flex flex-col gap-1">
          {enlaces.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.end}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm ${isActive ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:bg-slate-800'}`
              }
            >
              {e.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}