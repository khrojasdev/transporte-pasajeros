import { esperar, guardar, leer, nuevoId } from '../shared/store';
import type { Peaje } from './types';

const SEMILLA: Peaje[] = [
  { id: 'p1', nombre: 'Ruta 68 — Lo Prado', valor: 3400, activo: true },
  { id: 'p2', nombre: 'Ruta 68 — Zapata', valor: 3400, activo: true },
  { id: 'p3', nombre: 'Troncal Sur — Peñuelas', valor: 1200, activo: true },
];

export async function listarPeajes(): Promise<Peaje[]> {
  await esperar();
  return leer('peajes', SEMILLA);
}

export async function crearPeaje(p: Omit<Peaje, 'id'>) {
  const lista = await listarPeajes();
  return guardar('peajes', [...lista, { ...p, id: nuevoId() }]);
}

export async function actualizarPeaje(id: string, cambios: Partial<Peaje>) {
  const lista = await listarPeajes();
  return guardar('peajes', lista.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
}

export async function eliminarPeaje(id: string) {
  const lista = await listarPeajes();
  return guardar('peajes', lista.filter((p) => p.id !== id));
}