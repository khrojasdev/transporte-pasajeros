export interface Viaje {
  id: string;
  cotizacion_id: string | null;
  nombre_cliente: string;
  contacto: string;
  vehiculo_id: string;
  conductor_id: string | null;
  fecha: string;
  origen: string;
  destino: string;
  paradas: string[];
  tipo_servicio: string;
  estado: 'pendiente' | 'confirmado' | 'realizado' | 'cancelado';
  precio_acordado: number;
  ingreso_real: number | null;
  costo_estimado: number;
  created_at: string;
}

export interface Bitacora {
  viaje_id: string;
  cotizado_por: string;
  pasajeros: string[];
  cantidad_pasajeros: number;
  contactos_emergencia: { nombre: string; telefono: string }[];
  notas: string;
  hora_inicio_real: string | null;
  hora_termino_real: string | null;
  satisfaccion: number | null;
  comentario_cliente: string;
}
