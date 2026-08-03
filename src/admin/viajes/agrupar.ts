import type { Viaje } from './types';

export interface GrupoMes {
  clave: string;
  etiqueta: string;
  viajes: Viaje[];
}

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function agruparPorMes(viajes: Viaje[]): GrupoMes[] {
  const ordenados = [...viajes].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const grupos = new Map<string, GrupoMes>();
  for (const v of ordenados) {
    const d = new Date(v.fecha);
    const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!grupos.has(clave)) {
      grupos.set(clave, {
        clave,
        etiqueta: capitalizar(d.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })),
        viajes: [],
      });
    }
    grupos.get(clave)!.viajes.push(v);
  }

  return [...grupos.values()].sort((a, b) => b.clave.localeCompare(a.clave));
}
