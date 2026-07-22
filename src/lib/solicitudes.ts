export interface NuevaSolicitud {
  nombre_cliente: string;
  contacto: string;
  origen: string;
  destino: string;
  paradas: string[];
  fecha_estimada: string | null;
  cantidad_pasajeros: number;
  tipo_servicio: string;
  mensaje: string;
}

export async function enviarSolicitud(s: NuevaSolicitud) {
  const clave = 'transporte:solicitudes';
  const actuales = JSON.parse(window.localStorage.getItem(clave) ?? '[]');
  const nueva = {
    ...s,
    id: crypto.randomUUID(),
    estado: 'nueva',
    created_at: new Date().toISOString(),
  };
  window.localStorage.setItem(clave, JSON.stringify([nueva, ...actuales]));
  return nueva;
}