import { supabase } from '../../lib/supabase';
import type { Configuracion } from './types';

export async function obtenerConfiguracion(): Promise<Configuracion> {
  const { data, error } = await supabase.from('configuracion').select('*').eq('id', 1).single();
  if (error) throw error;
  return data as Configuracion;
}

export async function guardarConfiguracion(c: Configuracion): Promise<Configuracion> {
  const { data, error } = await supabase.from('configuracion').update(c).eq('id', 1).select().single();
  if (error) throw error;
  return data as Configuracion;
}