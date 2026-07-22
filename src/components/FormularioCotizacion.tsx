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
      // FASE 5: aquí se inserta en Supabase. Por ahora solo confirma.
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

  const input = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-amber-500';

  if (enviado) {
    return (
      <div className="rounded-xl border border-emerald-700 bg-emerald-950/30 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-400">¡Solicitud recibida!</p>
        <p className="mt-2 text-sm text-slate-300">Te contactaremos con la cotización a la brevedad.</p>
        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`} target="_blank" rel="noreferrer"
           className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950">
          Enviar también por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Tu nombre *</span>
          <input className={input} value={f.nombre_cliente} onChange={set('nombre_cliente')} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Teléfono / WhatsApp *</span>
          <input className={input} value={f.contacto} onChange={set('contacto')} placeholder="+56 9 ..." />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Origen *</span>
          <input className={input} value={f.origen} onChange={set('origen')} placeholder="Viña del Mar, Av. Libertad 1200" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Destino *</span>
          <input className={input} value={f.destino} onChange={set('destino')} placeholder="Aeropuerto SCL" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Paradas intermedias</span>
          <input className={input} value={f.paradas} onChange={set('paradas')} placeholder="Separadas por coma" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Fecha y hora</span>
          <input type="datetime-local" className={input} value={f.fecha_estimada} onChange={set('fecha_estimada')} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Pasajeros</span>
          <input type="number" min={1} className={input} value={f.cantidad_pasajeros} onChange={set('cantidad_pasajeros')} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Tipo de servicio</span>
          <select className={input} value={f.tipo_servicio} onChange={set('tipo_servicio')}>
            {TIPOS.map((t) => <option key={t.valor} value={t.valor}>{t.label}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Mensaje</span>
          <textarea rows={3} className={input} value={f.mensaje} onChange={set('mensaje')} />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={enviar} disabled={enviando}
                className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50">
          {enviando ? 'Enviando…' : 'Solicitar cotización'}
        </button>
        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`} target="_blank" rel="noreferrer"
           className="rounded-lg border border-slate-600 px-6 py-3 font-semibold hover:bg-slate-800">
          Enviar por WhatsApp
        </a>
      </div>
    </div>
  );
}