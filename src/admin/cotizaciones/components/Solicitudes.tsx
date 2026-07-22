import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { actualizarEstadoSolicitud, listarSolicitudes } from '../api';
import { TIPOS_SERVICIO, type SolicitudCotizacion } from '../types';
import { fecha } from '../../shared/formato';
import { Boton, Etiqueta, Tabla, Titulo, Vacio } from '../../shared/ui';

export default function Solicitudes() {
  const [lista, setLista] = useState<SolicitudCotizacion[]>([]);
  const cargar = () => listarSolicitudes().then(setLista);
  useEffect(() => { cargar(); }, []);

  const colores = { nueva: 'ambar', cotizada: 'verde', descartada: 'gris' } as const;

  return (
    <div>
      <Titulo>Solicitudes de cotización</Titulo>
      {lista.length === 0 ? <Vacio mensaje="No hay solicitudes todavía." /> : (
        <Tabla cabeceras={['Cliente', 'Ruta', 'Servicio', 'Fecha', 'Estado', '']}>
          {lista.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-3">
                <div>{s.nombre_cliente}</div>
                <div className="text-xs text-slate-500">{s.contacto}</div>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {[s.origen, ...(s.paradas ?? []), s.destino].join(' → ')}
                {s.cantidad_pasajeros && <div className="text-xs text-slate-500">{s.cantidad_pasajeros} pasajeros</div>}
              </td>
              <td className="px-4 py-3">{TIPOS_SERVICIO.find((t) => t.valor === s.tipo_servicio)?.label}</td>
              <td className="px-4 py-3 text-slate-400">{s.fecha_estimada ? fecha(s.fecha_estimada) : '—'}</td>
              <td className="px-4 py-3"><Etiqueta texto={s.estado} color={colores[s.estado]} /></td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link to={`/calculadora?solicitud=${s.id}`}
                        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400">
                    Cotizar
                  </Link>
                  <Boton variante="secundario" onClick={async () => { await actualizarEstadoSolicitud(s.id, 'descartada'); cargar(); }}>
                    Descartar
                  </Boton>
                </div>
              </td>
            </tr>
          ))}
        </Tabla>
      )}
    </div>
  );
}