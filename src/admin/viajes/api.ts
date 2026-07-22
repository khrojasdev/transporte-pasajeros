import { esperar, guardar, leer, nuevoId } from '../shared/store';
import type { Bitacora, Viaje } from './types';

export async function listarViajes(): Promise<Viaje[]> {
  await esperar();
  return leer<Viaje[]>('viajes', []);
}

export async function crearViaje(v: Omit<Viaje, 'id' | 'created_at'>): Promise<Viaje> {
  const lista = await listarViajes();
  const nuevo: Viaje = { ...v, id: nuevoId(), created_at: new Date().toISOString() };
  guardar('viajes', [nuevo, ...lista]);
  return nuevo;
}

export async function actualizarViaje(id: string, cambios: Partial<Viaje>) {
  const lista = await listarViajes();
  return guardar('viajes', lista.map((v) => (v.id === id ? { ...v, ...cambios } : v)));
}

export async function eliminarViaje(id: string) {
  const lista = await listarViajes();
  return guardar('viajes', lista.filter((v) => v.id !== id));
}

export async function obtenerBitacora(viajeId: string): Promise<Bitacora> {
  await esperar();
  const todas = leer<Record<string, Bitacora>>('bitacoras', {});
  return todas[viajeId] ?? {
    viaje_id: viajeId,
    cotizado_por: '',
    pasajeros: [],
    cantidad_pasajeros: 0,
    contactos_emergencia: [],
    notas: '',
    hora_inicio_real: null,
    hora_termino_real: null,
    satisfaccion: null,
    comentario_cliente: '',
  };
}

export async function guardarBitacora(b: Bitacora) {
  const todas = leer<Record<string, Bitacora>>('bitacoras', {});
  return guardar('bitacoras', { ...todas, [b.viaje_id]: b });
}
