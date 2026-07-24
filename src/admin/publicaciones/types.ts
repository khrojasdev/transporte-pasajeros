export interface Publicacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  fecha_evento: string | null;
  activa: boolean;
  created_at: string;
}