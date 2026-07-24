// Exporta a CSV con BOM UTF-8 para que Excel muestre bien tildes y ñ.
export function descargarCSV(nombreArchivo: string, filas: Record<string, unknown>[]) {
  if (!filas.length) return;
  const columnas = Object.keys(filas[0]);
  const escapar = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const contenido = [
    columnas.join(';'),
    ...filas.map((f) => columnas.map((c) => escapar(f[c])).join(';')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}