import { esperar, guardar, leer, nuevoId } from '../shared/store';
import type { Cotizacion, SolicitudCotizacion } from './types';

const solicitudesSemilla: SolicitudCotizacion[] = [
  {
    id: 's1',
    nombre_cliente: 'Camila Rojas',
    contacto: '+56 9 1234 5678',
    origen: 'Viña del Mar, Av. Libertad 1200',
    destino: 'Aeropuerto SCL',
    paradas: ['Valparaíso, Plaza Sotomayor'],
    fecha_estimada: new Date(Date.now() + 86400000 * 3).toISOString(),
    cantidad_pasajeros: 4,
    tipo_servicio: 'aeropuerto',
    mensaje: 'Vuelo sale 14:00, necesitamos llegar 2 h antes.',
    estado: 'nueva',
    created_at: new Date().toISOString(),
  },
];

export async function listarSolicitudes(): Promise<SolicitudCotizacion[]> {
  await esperar();
  return leer('solicitudes', solicitudesSemilla);
}

export async function actualizarEstadoSolicitud(id: string, estado: SolicitudCotizacion['estado']) {
  const lista = await listarSolicitudes();
  return guardar('solicitudes', lista.map((s) => (s.id === id ? { ...s, estado } : s)));
}

export async function listarCotizaciones(): Promise<Cotizacion[]> {
  await esperar();
  return leer<Cotizacion[]>('cotizaciones', []);
}

export async function crearCotizacion(c: Omit<Cotizacion, 'id' | 'created_at'>): Promise<Cotizacion> {
  const lista = await listarCotizaciones();
  const nueva: Cotizacion = { ...c, id: nuevoId(), created_at: new Date().toISOString() };
  guardar('cotizaciones', [nueva, ...lista]);
  if (c.solicitud_id) await actualizarEstadoSolicitud(c.solicitud_id, 'cotizada');
  return nueva;
}

export async function actualizarEstadoCotizacion(id: string, estado: Cotizacion['estado']) {
  const lista = await listarCotizaciones();
  return guardar('cotizaciones', lista.map((c) => (c.id === id ? { ...c, estado } : c)));
}