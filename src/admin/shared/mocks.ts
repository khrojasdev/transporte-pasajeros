export const mockVehiculos = [
  { id: 'v1', nombre: 'Hyundai H1', patente: 'ABCD12', rendimiento_l_100km: 10.5, costo_desgaste_km: 120, capacidad_pasajeros: 10, activo: true },
  { id: 'v2', nombre: 'Kia Carnival', patente: 'EFGH34', rendimiento_l_100km: 9.0,  costo_desgaste_km: 100, capacidad_pasajeros: 7,  activo: true },
];

export const mockPeajes = [
  { id: 'p1', nombre: 'Ruta 68 — Lo Prado',      valor: 3400, activo: true },
  { id: 'p2', nombre: 'Ruta 68 — Zapata',        valor: 3400, activo: true },
  { id: 'p3', nombre: 'Troncal Sur — Peñuelas',  valor: 1200, activo: true },
];

export const mockConfig = {
  precio_litro: 1350,
  margen_defecto: 30,
  tarifa_hora_espera: 10000,
  precio_minimo: 15000,
};