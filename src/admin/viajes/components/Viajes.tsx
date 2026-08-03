import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { actualizarViaje, crearViaje, eliminarViaje, listarViajes } from '../api';
import { agruparPorMes } from '../agrupar';
import type { Viaje } from '../types';
import { listarCotizaciones } from '../../cotizaciones/api';
import type { Cotizacion } from '../../cotizaciones/types';
import { clp, fecha } from '../../shared/formato';
import { descargarCSV } from '../../shared/csv';
import { Boton, Campo, Card, Input, Select, Tabla, Titulo, Vacio } from '../../shared/ui';

const ESTADOS: Viaje['estado'][] = ['pendiente', 'confirmado', 'realizado', 'cancelado'];

export default function Viajes() {
  const [lista, setLista] = useState<Viaje[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [filtro, setFiltro] = useState<'todos' | Viaje['estado']>('todos');
  const [cotSel, setCotSel] = useState('');
  const [fechaViaje, setFechaViaje] = useState('');

  const cargar = async () => {
    setLista(await listarViajes());
    setCotizaciones(await listarCotizaciones());
  };
  useEffect(() => { cargar(); }, []);

  // Al elegir una cotización, precargar su fecha estimada (editable)
  const elegirCotizacion = (id: string) => {
    setCotSel(id);
    const c = cotizaciones.find((x) => x.id === id);
    if (c?.fecha_estimada) {
      setFechaViaje(c.fecha_estimada.slice(0, 16));
    } else {
      setFechaViaje('');
    }
  };

  const crearDesdeCotizacion = async () => {
    const c = cotizaciones.find((x) => x.id === cotSel);
    if (!c || !fechaViaje) return;
    await crearViaje({
      cotizacion_id: c.id,
      nombre_cliente: c.nombre_cliente,
      contacto: c.contacto,
      vehiculo_id: c.vehiculo_id,
      conductor_id: null,
      fecha: new Date(fechaViaje).toISOString(),
      origen: c.origen,
      destino: c.destino,
      paradas: c.paradas,
      tipo_servicio: 'otro',
      estado: 'confirmado',
      precio_acordado: c.precio_final,
      ingreso_real: null,
      costo_estimado: c.costo_base,
    });
    setCotSel(''); setFechaViaje('');
    cargar();
  };

  const visibles = filtro === 'todos' ? lista : lista.filter((v) => v.estado === filtro);
  const grupos = agruparPorMes(visibles);

  return (
    <div>
      <Titulo
        accion={
          <Boton
            variante="secundario"
            onClick={() =>
              descargarCSV(
                `viajes-${new Date().toISOString().slice(0, 10)}.csv`,
                lista.map((v) => ({
                  fecha: new Date(v.fecha).toLocaleString('es-CL'),
                  cliente: v.nombre_cliente,
                  contacto: v.contacto,
                  origen: v.origen,
                  paradas: v.paradas.join(' | '),
                  destino: v.destino,
                  estado: v.estado,
                  precio_acordado: v.precio_acordado,
                  ingreso_real: v.ingreso_real ?? '',
                  costo_estimado: v.costo_estimado,
                  margen: (v.ingreso_real ?? v.precio_acordado) - v.costo_estimado,
                }))
              )
            }
          >
            Exportar CSV
          </Boton>
        }
      >
        Viajes
      </Titulo>

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Crear viaje desde una cotización</h2>
        {cotizaciones.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay cotizaciones guardadas. Ve a la Calculadora, genera una cotización y guárdala; aquí aparecerá para crear el viaje.
          </p>
        ) : (
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[280px] flex-1">
              <Campo label="Cotización">
                <Select value={cotSel} onChange={(e) => elegirCotizacion(e.target.value)}>
                  <option value="">Selecciona…</option>
                  {cotizaciones.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_cliente} · {c.origen} → {c.destino} · {clp(c.precio_final)}
                    </option>
                  ))}
                </Select>
              </Campo>
            </div>
            <div>
              <Campo label="Fecha y hora del viaje" hint="Se rellena de la cotización; edítala si cambió">
                <Input type="datetime-local" value={fechaViaje} onChange={(e) => setFechaViaje(e.target.value)} />
              </Campo>
            </div>
            <Boton onClick={crearDesdeCotizacion} disabled={!cotSel || !fechaViaje}>Crear viaje</Boton>
          </div>
        )}
      </Card>

      <div className="mb-4 flex gap-2">
        {(['todos', ...ESTADOS] as const).map((e) => (
          <button key={e} onClick={() => setFiltro(e)}
            className={`rounded-full px-3 py-1 text-xs ${filtro === e ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-400'}`}>
            {e}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? <Vacio mensaje="Sin viajes en este filtro." /> : (
        <div className="space-y-8">
          {grupos.map((grupo) => (
            <div key={grupo.clave}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{grupo.etiqueta}</h2>
              <Tabla cabeceras={['Fecha', 'Cliente', 'Ruta', 'Precio', 'Estado', '']}>
                {grupo.viajes.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-3 text-slate-300">{fecha(v.fecha)}</td>
                    <td className="px-4 py-3">{v.nombre_cliente}</td>
                    <td className="px-4 py-3 text-slate-400">{[v.origen, ...v.paradas, v.destino].join(' → ')}</td>
                    <td className="px-4 py-3">{clp(v.ingreso_real ?? v.precio_acordado)}</td>
                    <td className="px-4 py-3">
                      <Select value={v.estado} onChange={async (e) => { await actualizarViaje(v.id, { estado: e.target.value as Viaje['estado'] }); cargar(); }}>
                        {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/viaje?id=${v.id}`} className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">Bitácora</Link>
                        <Boton variante="peligro" onClick={async () => { await eliminarViaje(v.id); cargar(); }}>Eliminar</Boton>
                      </div>
                    </td>
                  </tr>
                ))}
              </Tabla>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}