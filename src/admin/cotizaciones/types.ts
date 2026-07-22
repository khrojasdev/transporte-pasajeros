export type TipoServicio = 'aeropuerto' | 'evento' | 'comida' | 'concierto' | 'otro';

export const TIPOS_SERVICIO: { valor: TipoServicio; label: string }[] = [
  { valor: 'aeropuerto', label: 'Aeropuerto' },
  { valor: 'evento', label: 'Evento / fiesta' },
  { valor: 'comida', label: 'Comida / almuerzo' },
  { valor: 'concierto', label: 'Concierto' },
  { valor: 'otro', label: 'Otro' },
];

export interface SolicitudCotizacion {
  id: string;
  nombre_cliente: string;
  contacto: string;
  origen: string;
  destino: string;
  paradas: string[];
  fecha_estimada: string | null;
  cantidad_pasajeros: number | null;
  tipo_servicio: TipoServicio;
  mensaje: string | null;
  estado: 'nueva' | 'cotizada' | 'descartada';
  created_at: string;
}

export interface Cotizacion {
  id: string;
  solicitud_id: string | null;
  nombre_cliente: string;
  contacto: string;
  vehiculo_id: string;
  origen: string;
  destino: string;
  paradas: string[];
  incluye_retorno: boolean;
  horas_espera: number;
  distancia_km: number;
  tiempo_estimado_min: number;
  peajes_detalle: { nombre: string; valor: number }[];
  peajes_total: number;
  bencina_total: number;
  desgaste_total: number;
  espera_total: number;
  costo_base: number;
  margen_pct: number;
  precio_final: number;
  estado: 'enviada' | 'aceptada' | 'rechazada';
  created_at: string;
}