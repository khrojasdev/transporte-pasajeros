import { supabase } from '../../lib/supabase';
import type { Peaje } from './types';

export async function listarPeajes(): Promise<Peaje[]> {
  const { data, error } = await supabase.from('peajes').select('*').order('nombre');
  if (error) throw error;
  return data as Peaje[];
}

export async function crearPeaje(p: Omit<Peaje, 'id'>) {
  const { error } = await supabase.from('peajes').insert(p);
  if (error) throw error;
}

export async function actualizarPeaje(id: string, cambios: Partial<Peaje>) {
  const { error } = await supabase.from('peajes').update(cambios).eq('id', id);
  if (error) throw error;
}

export async function eliminarPeaje(id: string) {
  const { error } = await supabase.from('peajes').delete().eq('id', id);
  if (error) throw error;
}