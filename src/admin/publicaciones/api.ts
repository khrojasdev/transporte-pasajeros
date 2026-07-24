import { supabase } from '../../lib/supabase';
import type { Publicacion } from './types';

const BUCKET = 'publicaciones';

export async function listarPublicaciones(): Promise<Publicacion[]> {
  const { data, error } = await supabase
    .from('publicaciones').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Publicacion[];
}

export async function crearPublicacion(p: Omit<Publicacion, 'id' | 'created_at'>) {
  const { error } = await supabase.from('publicaciones').insert(p);
  if (error) throw error;
}

export async function actualizarPublicacion(id: string, cambios: Partial<Publicacion>) {
  const { error } = await supabase.from('publicaciones').update(cambios).eq('id', id);
  if (error) throw error;
}

export async function eliminarPublicacion(id: string) {
  const { error } = await supabase.from('publicaciones').delete().eq('id', id);
  if (error) throw error;
}

// Sube una imagen al bucket y devuelve su URL pública
export async function subirImagen(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const nombre = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(nombre, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombre);
  return data.publicUrl;
}