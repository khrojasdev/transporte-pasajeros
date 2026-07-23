import { supabase } from '../../lib/supabase';
import type { Conductor, DocumentoVehiculo, Vehiculo } from './types';

export async function listarVehiculos(): Promise<Vehiculo[]> {
  const { data, error } = await supabase.from('vehiculos').select('*').order('nombre');
  if (error) throw error;
  return data as Vehiculo[];
}
export async function crearVehiculo(v: Omit<Vehiculo, 'id'>) {
  const { error } = await supabase.from('vehiculos').insert(v);
  if (error) throw error;
}
export async function actualizarVehiculo(id: string, cambios: Partial<Vehiculo>) {
  const { error } = await supabase.from('vehiculos').update(cambios).eq('id', id);
  if (error) throw error;
}
export async function eliminarVehiculo(id: string) {
  const { error } = await supabase.from('vehiculos').delete().eq('id', id);
  if (error) throw error;
}

export async function listarConductores(): Promise<Conductor[]> {
  const { data, error } = await supabase.from('conductores').select('*').order('nombre');
  if (error) throw error;
  return data as Conductor[];
}
export async function crearConductor(c: Omit<Conductor, 'id'>) {
  const { error } = await supabase.from('conductores').insert(c);
  if (error) throw error;
}
export async function eliminarConductor(id: string) {
  const { error } = await supabase.from('conductores').delete().eq('id', id);
  if (error) throw error;
}

export async function listarDocumentos(): Promise<DocumentoVehiculo[]> {
  const { data, error } = await supabase.from('documentos_vehiculo').select('*').order('fecha_vencimiento');
  if (error) throw error;
  return data as DocumentoVehiculo[];
}
export async function crearDocumento(d: Omit<DocumentoVehiculo, 'id'>) {
  const { error } = await supabase.from('documentos_vehiculo').insert(d);
  if (error) throw error;
}
export async function eliminarDocumento(id: string) {
  const { error } = await supabase.from('documentos_vehiculo').delete().eq('id', id);
  if (error) throw error;
}