const PREFIJO = 'transporte:';

export function leer<T>(clave: string, porDefecto: T): T {
  if (typeof window === 'undefined') return porDefecto;
  try {
    const crudo = window.localStorage.getItem(PREFIJO + clave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function guardar<T>(clave: string, valor: T): T {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
  }
  return valor;
}

export const nuevoId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

// Simula la latencia de una consulta real para que la UI se comporte igual en Fase 5
export const esperar = (ms = 120) => new Promise((r) => setTimeout(r, ms));