import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Viaje } from './types';
import { NEGOCIO } from '../../config/negocio';

const IVA = 0.19;

export async function generarComprobante(viaje: Viaje, correlativo: number) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const normal = await doc.embedFont(StandardFonts.Helvetica);
  const negrita = await doc.embedFont(StandardFonts.HelveticaBold);

  const texto = (t: string, x: number, y: number, size = 10, bold = false, gris = false) =>
    page.drawText(t, {
      x, y, size,
      font: bold ? negrita : normal,
      color: gris ? rgb(0.45, 0.45, 0.45) : rgb(0.1, 0.1, 0.1),
    });

  const monto = viaje.ingreso_real ?? viaje.precio_acordado;
  const neto = Math.round(monto / (1 + IVA));
  const iva = monto - neto;

  let y = 780;
  texto(NEGOCIO.nombre, 50, y, 18, true); y -= 18;
  texto('Transporte privado de pasajeros', 50, y, 10, false, true); y -= 14;
  texto(`${NEGOCIO.telefono} · ${NEGOCIO.email}`, 50, y, 9, false, true);

  texto('COMPROBANTE DE SERVICIO', 350, 780, 12, true);
  texto(`N° ${String(correlativo).padStart(5, '0')}`, 350, 762, 10);
  texto(`Emitido: ${new Date().toLocaleDateString('es-CL')}`, 350, 748, 9, false, true);

  y = 700;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });

  y -= 30;
  texto('CLIENTE', 50, y, 9, true, true); y -= 16;
  texto(viaje.nombre_cliente, 50, y, 11); y -= 14;
  texto(viaje.contacto, 50, y, 10, false, true);

  y -= 36;
  texto('DETALLE DEL SERVICIO', 50, y, 9, true, true); y -= 18;
  texto(`Fecha del viaje: ${new Date(viaje.fecha).toLocaleString('es-CL')}`, 50, y, 10); y -= 15;
  texto(`Origen: ${viaje.origen}`, 50, y, 10); y -= 15;
  viaje.paradas.forEach((p, i) => { texto(`Parada ${i + 1}: ${p}`, 50, y, 10); y -= 15; });
  texto(`Destino: ${viaje.destino}`, 50, y, 10); y -= 15;
  texto(`Tipo de servicio: ${viaje.tipo_servicio}`, 50, y, 10);

  y -= 50;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });

  const fila = (etiqueta: string, valor: number, bold = false) => {
    y -= 20;
    texto(etiqueta, 350, y, 10, bold);
    texto(valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }), 470, y, 10, bold);
  };
  fila('Neto', neto);
  fila('IVA (19%)', iva);
  y -= 6;
  page.drawLine({ start: { x: 350, y: y - 4 }, end: { x: 545, y: y - 4 }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  fila('TOTAL', monto, true);

  y -= 60;
  texto('Documento interno de respaldo. No constituye documento tributario electrónico.', 50, y, 8, false, true);

const bytes = await doc.save();
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comprobante-${String(correlativo).padStart(5, '0')}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}