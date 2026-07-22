import { esperar, guardar, leer } from '../shared/store';
import type { Configuracion } from './types';

const PORDEFECTO: Configuracion = {
  precio_litro: 1350,
  margen_defecto: 30,
  tarifa_hora_espera: 10000,
  precio_minimo: 15000,
};

export async function obtenerConfiguracion(): Promise<Configuracion> {
  await esperar();
  return leer('configuracion', PORDEFECTO);
}

export async function guardarConfiguracion(c: Configuracion): Promise<Configuracion> {
  return guardar('configuracion', c);
}