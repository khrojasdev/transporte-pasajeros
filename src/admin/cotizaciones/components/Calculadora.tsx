export interface EntradaCotizacion {
  distancia_km: number;
  tiempo_min: number;
  incluye_retorno: boolean;
  horas_espera: number;
  peajes_seleccionados: { nombre: string; valor: number }[];
  duplicar_peajes_en_retorno: boolean;
  vehiculo: { rendimiento_l_100km: number; costo_desgaste_km: number };
  config: { precio_litro: number; tarifa_hora_espera: number; precio_minimo: number };
  margen_pct: number;
}

export interface ResultadoCotizacion {
  distancia_km: number;
  tiempo_estimado_min: number;
  bencina_total: number;
  desgaste_total: number;
  peajes_total: number;
  espera_total: number;
  costo_base: number;
  precio_final: number;
  margen_clp: number;
  aplico_precio_minimo: boolean;
}

export function calcularCotizacion(e: EntradaCotizacion): ResultadoCotizacion {
  const factor = e.incluye_retorno ? 2 : 1;
  const distancia = e.distancia_km * factor;
  const tiempo = e.tiempo_min * factor;

  const bencina = (distancia / 100) * e.vehiculo.rendimiento_l_100km * e.config.precio_litro;
  const desgaste = distancia * e.vehiculo.costo_desgaste_km;

  const peajesIda = e.peajes_seleccionados.reduce((s, p) => s + p.valor, 0);
  const peajes = e.incluye_retorno && e.duplicar_peajes_en_retorno ? peajesIda * 2 : peajesIda;

  const espera = e.horas_espera * e.config.tarifa_hora_espera;

  const costoBase = Math.round(bencina + desgaste + peajes + espera);
  const precioCalculado = Math.round(costoBase * (1 + e.margen_pct / 100));
  const aplicoMinimo = precioCalculado < e.config.precio_minimo;
  const precioFinal = aplicoMinimo ? e.config.precio_minimo : precioCalculado;

  return {
    distancia_km: +distancia.toFixed(1),
    tiempo_estimado_min: Math.round(tiempo),
    bencina_total: Math.round(bencina),
    desgaste_total: Math.round(desgaste),
    peajes_total: peajes,
    espera_total: espera,
    costo_base: costoBase,
    precio_final: precioFinal,
    margen_clp: precioFinal - costoBase,
    aplico_precio_minimo: aplicoMinimo,
  };
}