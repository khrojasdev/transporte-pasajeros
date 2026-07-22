import { esperar, guardar, leer, nuevoId } from '../shared/store';
import type { Conductor, DocumentoVehiculo, Vehiculo } from './types';

const VEHICULOS_SEMILLA: Vehiculo[] = [
  { id: 'v1', nombre: 'Hyundai H1', patente: 'ABCD12', rendimiento_l_100km: 10.5, costo_desgaste_km: 120, capacidad_pasajeros: 10, activo: true },
];

export async function listarVehiculos(): Promise<Vehiculo[]> {
  await esperar();
  return leer('vehiculos', VEHICULOS_SEMILLA);
}
export async function crearVehiculo(v: Omit<Vehiculo, 'id'>) {
  const lista = await listarVehiculos();
  return guardar('vehiculos', [...lista, { ...v, id: nuevoId() }]);
}
export async function actualizarVehiculo(id: string, cambios: Partial<Vehiculo>) {
  const lista = await listarVehiculos();
  return guardar('vehiculos', lista.map((v) => (v.id === id ? { ...v, ...cambios } : v)));
}
export async function eliminarVehiculo(id: string) {
  const lista = await listarVehiculos();
  return guardar('vehiculos', lista.filter((v) => v.id !== id));
}

export async function listarConductores(): Promise<Conductor[]> {
  await esperar();
  return leer<Conductor[]>('conductores', []);
}
export async function crearConductor(c: Omit<Conductor, 'id'>) {
  const lista = await listarConductores();
  return guardar('conductores', [...lista, { ...c, id: nuevoId() }]);
}
export async function eliminarConductor(id: string) {
  const lista = await listarConductores();
  return guardar('conductores', lista.filter((c) => c.id !== id));
}

export async function listarDocumentos(): Promise<DocumentoVehiculo[]> {
  await esperar();
  return leer<DocumentoVehiculo[]>('documentos', []);
}
export async function crearDocumento(d: Omit<DocumentoVehiculo, 'id'>) {
  const lista = await listarDocumentos();
  return guardar('documentos', [...lista, { ...d, id: nuevoId() }]);
}
export async function eliminarDocumento(id: string) {
  const lista = await listarDocumentos();
  return guardar('documentos', lista.filter((d) => d.id !== id));
}