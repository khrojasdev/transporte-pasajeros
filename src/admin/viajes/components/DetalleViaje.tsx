import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { actualizarViaje, guardarBitacora, listarViajes, obtenerBitacora } from '../api';
import type { Bitacora, Viaje } from '../types';
import { clp, fecha } from '../../shared/formato';
import { generarComprobante } from '../comprobante';
import { Boton, Campo, Card, Input, Titulo } from '../../shared/ui';

export default function DetalleViaje() {
  const [params] = useSearchParams();
  const id = params.get('id') ?? '';
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [b, setB] = useState<Bitacora | null>(null);
  const [ingreso, setIngreso] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const v = (await listarViajes()).find((x) => x.id === id) ?? null;
      setViaje(v);
      setIngreso(v?.ingreso_real ?? v?.precio_acordado ?? 0);
      setB(await obtenerBitacora(id));
    })();
  }, [id]);

  if (!viaje || !b) return <p className="text-slate-400">Cargando…</p>;

  const guardar = async () => {
    await guardarBitacora(b);
    await actualizarViaje(viaje.id, { ingreso_real: ingreso });
    setMsg('Guardado ✔');
  };

  return (
    <div>
      <Link to="/viajes" className="mb-4 inline-block text-sm text-amber-400">← Volver a viajes</Link>
      <Titulo>Bitácora del viaje</Titulo>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Datos del viaje</h2>
          <dl className="space-y-2 text-sm">
            <Dato k="Cliente" v={`${viaje.nombre_cliente} · ${viaje.contacto}`} />
            <Dato k="Fecha" v={fecha(viaje.fecha)} />
            <Dato k="Ruta" v={[viaje.origen, ...viaje.paradas, viaje.destino].join(' → ')} />
            <Dato k="Precio acordado" v={clp(viaje.precio_acordado)} />
            <Dato k="Costo estimado" v={clp(viaje.costo_estimado)} />
            <Dato k="Estado" v={viaje.estado} />
          </dl>
          <div className="mt-4">
            <Campo label="Ingreso real cobrado (CLP)">
              <Input type="number" value={ingreso} onChange={(e) => setIngreso(+e.target.value)} />
            </Campo>
          </div>
          <div className="mt-4">
            <Boton
              variante="secundario"
              onClick={() => generarComprobante({ ...viaje, ingreso_real: ingreso }, 1)}
              className="w-full"
            >
              Descargar comprobante PDF
            </Boton>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Registro</h2>
          <div className="space-y-4">
            <Campo label="Cotizado / gestionado por">
              <Input value={b.cotizado_por} onChange={(e) => setB({ ...b, cotizado_por: e.target.value })} />
            </Campo>
            <Campo label="Pasajeros (separados por coma)">
              <Input value={b.pasajeros.join(', ')}
                     onChange={(e) => setB({ ...b, pasajeros: e.target.value.split(',').map((p) => p.trim()).filter(Boolean) })} />
            </Campo>
            <Campo label="Cantidad de pasajeros">
              <Input type="number" value={b.cantidad_pasajeros} onChange={(e) => setB({ ...b, cantidad_pasajeros: +e.target.value })} />
            </Campo>
            <Campo label="Contactos de emergencia" hint="Formato: Nombre:Teléfono, separados por coma">
              <Input
                value={b.contactos_emergencia.map((c) => `${c.nombre}:${c.telefono}`).join(', ')}
                onChange={(e) =>
                  setB({
                    ...b,
                    contactos_emergencia: e.target.value.split(',').map((par) => {
                      const [nombre = '', telefono = ''] = par.split(':');
                      return { nombre: nombre.trim(), telefono: telefono.trim() };
                    }).filter((c) => c.nombre),
                  })
                }
              />
            </Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Hora inicio real">
                <Input type="datetime-local" value={b.hora_inicio_real ?? ''} onChange={(e) => setB({ ...b, hora_inicio_real: e.target.value })} />
              </Campo>
              <Campo label="Hora término real">
                <Input type="datetime-local" value={b.hora_termino_real ?? ''} onChange={(e) => setB({ ...b, hora_termino_real: e.target.value })} />
              </Campo>
            </div>
            <Campo label="Notas / incidencias">
              <textarea
                value={b.notas} onChange={(e) => setB({ ...b, notas: e.target.value })} rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-500"
              />
            </Campo>
            <Campo label="Satisfacción del cliente (1 a 5)">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setB({ ...b, satisfaccion: n })}
                    className={`h-9 w-9 rounded-lg text-sm ${b.satisfaccion === n ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-400'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </Campo>
            <Boton onClick={guardar} className="w-full">Guardar bitácora</Boton>
            {msg && <p className="text-center text-sm text-emerald-400">{msg}</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Dato({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{k}</dt>
      <dd className="text-right text-slate-200">{v}</dd>
    </div>
  );
}