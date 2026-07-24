import { listarCotizaciones } from '../cotizaciones/api';
import { listarViajes } from '../viajes/api';
import { listarDocumentos, listarVehiculos } from '../vehiculos/api';

export async function obtenerResumen() {
  const [viajes, cotizaciones, documentos, vehiculos] = await Promise.all([
    listarViajes(), listarCotizaciones(), listarDocumentos(), listarVehiculos(),
  ]);

  const realizados = viajes.filter((v) => v.estado === 'realizado');
  const ingresos = realizados.reduce((s, v) => s + (v.ingreso_real ?? v.precio_acordado), 0);
  const costos = realizados.reduce((s, v) => s + v.costo_estimado, 0);

  // Ingresos por mes (últimos 6 meses)
  const meses: { mes: string; ingresos: number; costos: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const clave = `${d.getFullYear()}-${d.getMonth()}`;
    const delMes = realizados.filter((v) => {
      const f = new Date(v.fecha);
      return `${f.getFullYear()}-${f.getMonth()}` === clave;
    });
    meses.push({
      mes: d.toLocaleDateString('es-CL', { month: 'short' }),
      ingresos: delMes.reduce((s, v) => s + (v.ingreso_real ?? v.precio_acordado), 0),
      costos: delMes.reduce((s, v) => s + v.costo_estimado, 0),
    });
  }

  // Ingresos por tipo de servicio
  const porTipo = Object.entries(
    realizados.reduce<Record<string, number>>((acc, v) => {
      acc[v.tipo_servicio] = (acc[v.tipo_servicio] ?? 0) + (v.ingreso_real ?? v.precio_acordado);
      return acc;
    }, {})
  ).map(([nombre, valor]) => ({ nombre, valor }));

  const aceptadas = cotizaciones.filter((c) => c.estado === 'aceptada').length;
  const conversion = cotizaciones.length ? Math.round((aceptadas / cotizaciones.length) * 100) : 0;

  const ahora = Date.now();
  const proximos = viajes
    .filter((v) => v.estado === 'confirmado' && new Date(v.fecha).getTime() > ahora && new Date(v.fecha).getTime() < ahora + 48 * 3600000)
    .sort((a, b) => +new Date(a.fecha) - +new Date(b.fecha));

  const alertasDocs = documentos
    .map((d) => ({ ...d, dias: Math.ceil((new Date(d.fecha_vencimiento).getTime() - ahora) / 86400000) }))
    .filter((d) => d.dias < 30)
    .map((d) => ({ ...d, vehiculo: vehiculos.find((v) => v.id === d.vehiculo_id)?.nombre ?? '—' }))
    .sort((a, b) => a.dias - b.dias);

  const recurrentes = Object.entries(
    viajes.reduce<Record<string, { viajes: number; total: number; contacto: string }>>((acc, v) => {
      const k = v.nombre_cliente;
      acc[k] = acc[k] ?? { viajes: 0, total: 0, contacto: v.contacto };
      acc[k].viajes += 1;
      acc[k].total += v.ingreso_real ?? v.precio_acordado;
      return acc;
    }, {})
  )
    .map(([nombre, d]) => ({ nombre, ...d }))
    .sort((a, b) => b.viajes - a.viajes)
    .slice(0, 5);

  return {
    ingresos, costos, margen: ingresos - costos,
    viajesRealizados: realizados.length,
    cotizacionesEnviadas: cotizaciones.length,
    conversion, meses, porTipo, proximos, alertasDocs, recurrentes,
    viajes: realizados,
  };
}