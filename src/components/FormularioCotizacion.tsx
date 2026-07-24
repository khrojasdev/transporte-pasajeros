import { useState } from 'react';

const TIPOS = [
  { valor: 'aeropuerto', label: 'Aeropuerto' },
  { valor: 'evento', label: 'Evento / fiesta' },
  { valor: 'comida', label: 'Comida / almuerzo' },
  { valor: 'concierto', label: 'Concierto' },
  { valor: 'otro', label: 'Otro' },
];

export default function FormularioCotizacion({ whatsapp }: { whatsapp: string }) {
  const [f, setF] = useState({
    nombre_cliente: '', contacto: '', origen: '', destino: '',
    paradas: '', fecha_estimada: '', cantidad_pasajeros: 2,
    tipo_servicio: 'aeropuerto', mensaje: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const paradasArray = f.paradas.split(',').map((p) => p.trim()).filter(Boolean);

  const texto =
    `Hola, quiero cotizar un traslado.\n\n` +
    `Nombre: ${f.nombre_cliente}\n` +
    `Origen: ${f.origen}\n` +
    (paradasArray.length ? `Paradas: ${paradasArray.join(' · ')}\n` : '') +
    `Destino: ${f.destino}\n` +
    `Fecha: ${f.fecha_estimada}\n` +
    `Pasajeros: ${f.cantidad_pasajeros}\n` +
    `Servicio: ${TIPOS.find((t) => t.valor === f.tipo_servicio)?.label}\n` +
    (f.mensaje ? `\n${f.mensaje}` : '');

  const enviar = async () => {
    setError('');
    if (!f.nombre_cliente || !f.contacto || !f.origen || !f.destino) {
      setError('Completa nombre, contacto, origen y destino.');
      return;
    }
    setEnviando(true);
    try {
      const { enviarSolicitud } = await import('../lib/solicitudes');
      await enviarSolicitud({
        ...f,
        paradas: paradasArray,
        cantidad_pasajeros: Number(f.cantidad_pasajeros),
        fecha_estimada: f.fecha_estimada || null,
      });
      setEnviado(true);
    } catch (e) {
      setError('No pudimos registrar la solicitud. Escríbenos por WhatsApp.');
    } finally {
      setEnviando(false);
    }
  };

  const input = 'w-full rounded-lg border border-marino/20 bg-white px-3 py-2.5 text-sm text-marino outline-none focus:border-naranja focus:ring-1 focus:ring-naranja';
  const label = 'mb-1 block text-xs font-medium uppercase tracking-wide text-marino/60';

  if (enviado) {
    return (
      <div className="rounded-2xl border border-verde/30 bg-verde/10 p-8 text-center">
        <p className="text-lg font-semibold text-verde">¡Solicitud recibida!</p>
        <p className="mt-2 text-sm text-marino/70">Te contactaré con la cotización a la brevedad.</p>
        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`} target="_blank" rel="noreferrer"
           className="mt-6 inline-block rounded-lg bg-naranja px-6 py-3 font-semibold text-white transition hover:bg-naranja/90">
          Enviar también por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-marino/10 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Tu nombre *</span>
          <input className={input} value={f.nombre_cliente} onChange={set('nombre_cliente')} />
        </label>
        <label className="block">
          <span className={label}>Teléfono / WhatsApp *</span>
          <input className={input} value={f.contacto} onChange={set('contacto')} placeholder="+56 9 ..." />
        </label>
        <label className="block">
          <span className={label}>Origen *</span>
          <input className={input} value={f.origen} onChange={set('origen')} placeholder="Viña del Mar, Av. Libertad 1200" />
        </label>
        <label className="block">
          <span className={label}>Destino *</span>
          <input className={input} value={f.destino} onChange={set('destino')} placeholder="Aeropuerto SCL" />
        </label>
        <label className="block sm:col-span-2">
          <span className={label}>Paradas intermedias</span>
          <input className={input} value={f.paradas} onChange={set('paradas')} placeholder="Separadas por coma" />
        </label>
        <label className="block">
          <span className={label}>Fecha y hora</span>
          <input type="datetime-local" className={input} value={f.fecha_estimada} onChange={set('fecha_estimada')} />
        </label>
        <label className="block">
          <span className={label}>Pasajeros</span>
          <input type="number" min={1} max={6} className={input} value={f.cantidad_pasajeros} onChange={set('cantidad_pasajeros')} />
        </label>
        <label className="block sm:col-span-2">
          <span className={label}>Tipo de servicio</span>
          <select className={input} value={f.tipo_servicio} onChange={set('tipo_servicio')}>
            {TIPOS.map((t) => <option key={t.valor} value={t.valor}>{t.label}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className={label}>Mensaje</span>
          <textarea rows={3} className={input} value={f.mensaje} onChange={set('mensaje')} />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={enviar} disabled={enviando}
                className="rounded-lg bg-naranja px-6 py-3 font-semibold text-white transition hover:bg-naranja/90 disabled:opacity-50">
          {enviando ? 'Enviando…' : 'Solicitar cotización'}
        </button>
        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`} target="_blank" rel="noreferrer"
           className="rounded-lg border border-marino/30 px-6 py-3 font-semibold text-marino transition hover:bg-marino/5">
          Enviar por WhatsApp
        </a>
      </div>
    </div>
  );
}