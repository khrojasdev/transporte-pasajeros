export interface Vehiculo {
  id: string;
  nombre: string;
  patente: string;
  rendimiento_l_100km: number;
  costo_desgaste_km: number;
  capacidad_pasajeros: number;
  activo: boolean;
}

export interface Conductor {
  id: string;
  nombre: string;
  telefono: string;
  numero_licencia: string;
  tipo_licencia: string;
  vencimiento_licencia: string | null;
  activo: boolean;
}

export interface DocumentoVehiculo {
  id: string;
  vehiculo_id: string;
  tipo: 'permiso_circulacion' | 'revision_tecnica' | 'seguro' | 'otro';
  fecha_vencimiento: string;
  notas: string | null;
}

export const TIPOS_DOCUMENTO = [
  { valor: 'permiso_circulacion', label: 'Permiso de circulación' },
  { valor: 'revision_tecnica', label: 'Revisión técnica' },
  { valor: 'seguro', label: 'Seguro' },
  { valor: 'otro', label: 'Otro' },
] as const;