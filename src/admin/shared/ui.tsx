import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/50 p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Titulo({ children, accion }: { children: ReactNode; accion?: ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold">{children}</h1>
      {accion}
    </div>
  );
}

export function Boton({
  children,
  variante = 'primario',
  ...props
}: { children: ReactNode; variante?: 'primario' | 'secundario' | 'peligro' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const estilos = {
    primario: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
    secundario: 'border border-slate-700 text-slate-200 hover:bg-slate-800',
    peligro: 'bg-red-600 text-white hover:bg-red-500',
  }[variante];
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-40 ${estilos} ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}

export function Campo({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

const baseInput =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-500';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className ?? ''}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInput} ${props.className ?? ''}`} />;
}

export function Tabla({ cabeceras, children }: { cabeceras: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-400">
          <tr>{cabeceras.map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-800">{children}</tbody>
      </table>
    </div>
  );
}

export function Etiqueta({ texto, color }: { texto: string; color: 'gris' | 'verde' | 'ambar' | 'rojo' | 'azul' }) {
  const estilos = {
    gris: 'bg-slate-700 text-slate-200',
    verde: 'bg-emerald-600/20 text-emerald-400',
    ambar: 'bg-amber-500/20 text-amber-400',
    rojo: 'bg-red-600/20 text-red-400',
    azul: 'bg-sky-600/20 text-sky-400',
  }[color];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estilos}`}>{texto}</span>;
}

export function Vacio({ mensaje }: { mensaje: string }) {
  return <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center text-slate-500">{mensaje}</div>;
}