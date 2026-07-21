export const clp = (n: number) =>
  n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export const minAHoras = (m: number) =>
  `${Math.floor(m / 60)} h ${Math.round(m % 60)} min`;

export const fecha = (d: string | Date) =>
  new Date(d).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });