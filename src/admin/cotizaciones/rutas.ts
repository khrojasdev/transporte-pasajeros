import { supabase } from '../../lib/supabase';

export interface Lugar {
  etiqueta: string;
  coordenadas: [number, number]; // [lng, lat]
}

export async function buscarLugar(direccion: string): Promise<Lugar[]> {
  const { data, error } = await supabase.functions.invoke('cotizar-ruta', { body: { direccion } });
  if (error) throw error;
  return data.resultados as Lugar[];
}

export async function calcularRuta(coordenadas: [number, number][]) {
  const { data, error } = await supabase.functions.invoke('cotizar-ruta', { body: { coordenadas } });
  if (error) throw error;
  if (data.error) throw new Error(data.error);
  return data as { distancia_km: number; tiempo_min: number };
}