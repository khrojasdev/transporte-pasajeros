import { supabase } from './supabase';

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
  const { error } = await supabase.from('solicitudes_cotizacion').insert({
    ...s,
    fecha_estimada: s.fecha_estimada ? new Date(s.fecha_estimada).toISOString() : null,
  });
  if (error) throw error;
}