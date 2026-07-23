import { supabase } from '../../lib/supabase';
import type { Cotizacion, SolicitudCotizacion } from './types';

export async function listarSolicitudes(): Promise<SolicitudCotizacion[]> {
  const { data, error } = await supabase
    .from('solicitudes_cotizacion').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as SolicitudCotizacion[];
}

export async function actualizarEstadoSolicitud(id: string, estado: SolicitudCotizacion['estado']) {
  const { error } = await supabase.from('solicitudes_cotizacion').update({ estado }).eq('id', id);
  if (error) throw error;
}

export async function listarCotizaciones(): Promise<Cotizacion[]> {
  const { data, error } = await supabase
    .from('cotizaciones').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Cotizacion[];
}

export async function crearCotizacion(c: Omit<Cotizacion, 'id' | 'created_at'>): Promise<Cotizacion> {
  const { data, error } = await supabase.from('cotizaciones').insert(c).select().single();
  if (error) throw error;
  if (c.solicitud_id) await actualizarEstadoSolicitud(c.solicitud_id, 'cotizada');
  return data as Cotizacion;
}

export async function actualizarEstadoCotizacion(id: string, estado: Cotizacion['estado']) {
  const { error } = await supabase.from('cotizaciones').update({ estado }).eq('id', id);
  if (error) throw error;
}