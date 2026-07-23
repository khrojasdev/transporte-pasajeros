import { supabase } from '../../lib/supabase';
import type { Bitacora, Viaje } from './types';

export async function listarViajes(): Promise<Viaje[]> {
  const { data, error } = await supabase.from('viajes').select('*').order('fecha', { ascending: false });
  if (error) throw error;
  return data as Viaje[];
}

export async function crearViaje(v: Omit<Viaje, 'id' | 'created_at'>): Promise<Viaje> {
  const { data, error } = await supabase.from('viajes').insert(v).select().single();
  if (error) throw error;
  return data as Viaje;
}

export async function actualizarViaje(id: string, cambios: Partial<Viaje>) {
  const { error } = await supabase.from('viajes').update(cambios).eq('id', id);
  if (error) throw error;
}

export async function eliminarViaje(id: string) {
  const { error } = await supabase.from('viajes').delete().eq('id', id);
  if (error) throw error;
}

export async function obtenerBitacora(viajeId: string): Promise<Bitacora> {
  const { data } = await supabase.from('bitacora_viaje').select('*').eq('viaje_id', viajeId).maybeSingle();
  return (data as Bitacora) ?? {
    viaje_id: viajeId, cotizado_por: '', pasajeros: [], cantidad_pasajeros: 0,
    contactos_emergencia: [], notas: '', hora_inicio_real: null, hora_termino_real: null,
    satisfaccion: null, comentario_cliente: '',
  };
}

export async function guardarBitacora(b: Bitacora) {
  const { error } = await supabase.from('bitacora_viaje').upsert(b, { onConflict: 'viaje_id' });
  if (error) throw error;
}