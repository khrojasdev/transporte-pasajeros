import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { obtenerResumen } from '../api';
import { clp, fecha } from '../../shared/formato';
import { Card, Titulo } from '../../shared/ui';

type Resumen = Awaited<ReturnType<typeof obtenerResumen>>;
const COLORES = ['#F5A524', '#38BDF8', '#34D399', '#A78BFA', '#F87171'];
const ESTILO_TOOLTIP = { background: '#0f172a', border: '1px solid #334155' };

export default function Dashboard() {
  const [r, setR] = useState<Resumen | null>(null);
  useEffect(() => { obtenerResumen().then(setR); }, []);
  if (!r) return <p className="text-slate-400">Cargando…</p>;

  return (
    <div>
      <Titulo>Dashboard</Titulo>

      {r.proximos.length > 0 && (
        <Card className="mb-4 border-sky-700 bg-sky-950/40">
          <p className="mb-2 font-semibold text-sky-300">Viajes en las próximas 48 horas</p>
          <ul className="space-y-1 text-sm text-slate-300">
            {r.proximos.map((v) => (
              <li key={v.id}>{fecha(v.fecha)} · {v.nombre_cliente} · {v.origen} → {v.destino}</li>
            ))}
          </ul>
        </Card>
      )}

      {r.alertasDocs.length > 0 && (
        <Card className="mb-6 border-amber-700 bg-amber-950/30">
          <p className="mb-2 font-semibold text-amber-300">Documentos por vencer</p>
          <ul className="space-y-1 text-sm text-slate-300">
            {r.alertasDocs.map((d) => (
              <li key={d.id} className={d.dias < 7 ? 'text-red-400' : ''}>
                {d.vehiculo} · {d.tipo.replace('_', ' ')} · {d.dias < 0 ? 'VENCIDO' : `vence en ${d.dias} días`}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Ingresos" valor={clp(r.ingresos)} />
        <Kpi label="Costos estimados" valor={clp(r.costos)} />
        <Kpi label="Margen" valor={clp(r.margen)} destacado />
        <Kpi label="Conversión" valor={`${r.conversion}%`} sub={`${r.cotizacionesEnviadas} cotizaciones`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Ingresos vs costos (6 meses)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={r.meses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${Number(v) / 1000}k`} />
                <Tooltip formatter={(v) => clp(Number(v))} contentStyle={ESTILO_TOOLTIP} />
                <Legend />
                <Bar dataKey="ingresos" fill="#F5A524" name="Ingresos" />
                <Bar dataKey="costos" fill="#475569" name="Costos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Ingresos por tipo de servicio</h2>
          <div className="h-72">
            {r.porTipo.length === 0 ? (
              <p className="pt-20 text-center text-slate-500">Sin viajes realizados aún.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={r.porTipo} dataKey="valor" nameKey="nombre" outerRadius={100} label>
                    {r.porTipo.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => clp(Number(v))} contentStyle={ESTILO_TOOLTIP} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, valor, sub, destacado }: { label: string; valor: string; sub?: string; destacado?: boolean }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${destacado ? 'text-amber-400' : ''}`}>{valor}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </Card>
  );
}