import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calcularCotizacion } from '../calculo';
import { crearCotizacion, listarSolicitudes } from '../api';
import { listarVehiculos } from '../../vehiculos/api';
import { listarPeajes } from '../../peajes/api';
import { obtenerConfiguracion } from '../../configuracion/api';
import type { Vehiculo } from '../../vehiculos/types';
import type { Peaje } from '../../peajes/types';
import type { Configuracion } from '../../configuracion/types';
import { clp, minAHoras } from '../../shared/formato';
import { Boton, Campo, Card, Input, Select, Titulo } from '../../shared/ui';

export default function Calculadora() {
  const [params] = useSearchParams();
  const solicitudId = params.get('solicitud');

  // ---- catálogos ----
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [peajes, setPeajes] = useState<Peaje[]>([]);
  const [config, setConfig] = useState<Configuracion | null>(null);

  // ---- formulario ----
  const [nombreCliente, setNombreCliente] = useState('');
  const [contacto, setContacto] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [paradas, setParadas] = useState<string[]>([]);
  const [vehiculoId, setVehiculoId] = useState('');
  const [distanciaKm, setDistanciaKm] = useState(0);
  const [tiempoMin, setTiempoMin] = useState(0);
  const [incluyeRetorno, setIncluyeRetorno] = useState(false);
  const [duplicarPeajes, setDuplicarPeajes] = useState(true);
  const [horasEspera, setHorasEspera] = useState(0);
  const [peajesSel, setPeajesSel] = useState<string[]>([]);
  const [margen, setMargen] = useState(30);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    (async () => {
      const [v, p, c] = await Promise.all([listarVehiculos(), listarPeajes(), obtenerConfiguracion()]);
      setVehiculos(v.filter((x) => x.activo));
      setPeajes(p.filter((x) => x.activo));
      setConfig(c);
      setMargen(c.margen_defecto);
      if (v.length) setVehiculoId(v[0].id);
    })();
  }, []);

  // Precarga desde una solicitud (botón "Cotizar" en Solicitudes)
  useEffect(() => {
    if (!solicitudId) return;
    (async () => {
      const s = (await listarSolicitudes()).find((x) => x.id === solicitudId);
      if (!s) return;
      setNombreCliente(s.nombre_cliente);
      setContacto(s.contacto);
      setOrigen(s.origen);
      setDestino(s.destino);
      setParadas(s.paradas ?? []);
    })();
  }, [solicitudId]);

  const vehiculo = vehiculos.find((v) => v.id === vehiculoId);

  const resultado = useMemo(() => {
    if (!vehiculo || !config) return null;
    return calcularCotizacion({
      distancia_km: distanciaKm,
      tiempo_min: tiempoMin,
      incluye_retorno: incluyeRetorno,
      horas_espera: horasEspera,
      peajes_seleccionados: peajes.filter((p) => peajesSel.includes(p.id)).map((p) => ({ nombre: p.nombre, valor: p.valor })),
      duplicar_peajes_en_retorno: duplicarPeajes,
      vehiculo: { rendimiento_l_100km: vehiculo.rendimiento_l_100km, costo_desgaste_km: vehiculo.costo_desgaste_km },
      config: { precio_litro: config.precio_litro, tarifa_hora_espera: config.tarifa_hora_espera, precio_minimo: config.precio_minimo },
      margen_pct: margen,
    });
  }, [vehiculo, config, distanciaKm, tiempoMin, incluyeRetorno, horasEspera, peajes, peajesSel, duplicarPeajes, margen]);

  const cambiarParada = (i: number, valor: string) =>
    setParadas(paradas.map((p, idx) => (idx === i ? valor : p)));
  const moverParada = (i: number, delta: number) => {
    const nuevo = [...paradas];
    const destinoIdx = i + delta;
    if (destinoIdx < 0 || destinoIdx >= nuevo.length) return;
    [nuevo[i], nuevo[destinoIdx]] = [nuevo[destinoIdx], nuevo[i]];
    setParadas(nuevo);
  };

  const guardar = async () => {
    if (!resultado || !vehiculo) return;
    if (!nombreCliente || !origen || !destino) {
      setMensaje('Completa cliente, origen y destino.');
      return;
    }
    setGuardando(true);
    try {
      await crearCotizacion({
        solicitud_id: solicitudId,
        nombre_cliente: nombreCliente,
        contacto,
        vehiculo_id: vehiculo.id,
        origen,
        destino,
        paradas,
        incluye_retorno: incluyeRetorno,
        horas_espera: horasEspera,
        distancia_km: resultado.distancia_km,
        tiempo_estimado_min: resultado.tiempo_estimado_min,
        peajes_detalle: peajes.filter((p) => peajesSel.includes(p.id)).map((p) => ({ nombre: p.nombre, valor: p.valor })),
        peajes_total: resultado.peajes_total,
        bencina_total: resultado.bencina_total,
        desgaste_total: resultado.desgaste_total,
        espera_total: resultado.espera_total,
        costo_base: resultado.costo_base,
        margen_pct: margen,
        precio_final: resultado.precio_final,
        estado: 'enviada',
      });
      setMensaje('Cotización guardada ✔');
    } finally {
      setGuardando(false);
    }
  };

  const textoWhatsApp = () => {
    if (!resultado) return '';
    const ruta = [origen, ...paradas, destino].filter(Boolean).join(' → ');
    const texto =
      `Hola ${nombreCliente}, tu cotización de traslado:\n\n` +
      `Ruta: ${ruta}\n` +
      `Distancia: ${resultado.distancia_km} km\n` +
      `Duración estimada: ${minAHoras(resultado.tiempo_estimado_min)}\n` +
      (incluyeRetorno ? 'Incluye retorno\n' : '') +
      (horasEspera ? `Espera: ${horasEspera} h\n` : '') +
      `\nValor total: ${clp(resultado.precio_final)}`;
    const tel = contacto.replace(/\D/g, '');
    return `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
  };

  if (!config) return <p className="text-slate-400">Cargando…</p>;

  return (
    <div>
      <Titulo>Calculadora de cotización</Titulo>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* ---------------- FORMULARIO ---------------- */}
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-semibold">Cliente</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Nombre">
                <Input value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />
              </Campo>
              <Campo label="Contacto / WhatsApp" hint="Con código país, ej: 56912345678">
                <Input value={contacto} onChange={(e) => setContacto(e.target.value)} />
              </Campo>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Ruta</h2>
            <div className="space-y-4">
              <Campo label="Origen">
                <Input value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Viña del Mar, Av. Libertad 1200" />
              </Campo>

              {paradas.map((p, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Campo label={`Parada ${i + 1}`}>
                      <Input value={p} onChange={(e) => cambiarParada(i, e.target.value)} />
                    </Campo>
                  </div>
                  <Boton variante="secundario" onClick={() => moverParada(i, -1)} disabled={i === 0}>↑</Boton>
                  <Boton variante="secundario" onClick={() => moverParada(i, 1)} disabled={i === paradas.length - 1}>↓</Boton>
                  <Boton variante="peligro" onClick={() => setParadas(paradas.filter((_, idx) => idx !== i))}>✕</Boton>
                </div>
              ))}

              <Boton variante="secundario" onClick={() => setParadas([...paradas, ''])}>+ Agregar parada</Boton>

              <Campo label="Destino">
                <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Aeropuerto SCL" />
              </Campo>
            </div>
          </Card>

          <Card>
            <h2 className="mb-1 font-semibold">Distancia y tiempo</h2>
            <p className="mb-4 text-xs text-slate-500">
              Por ahora se ingresan a mano. En la Fase 6 se llenan solos con la API de rutas.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Distancia (km, solo ida)">
                <Input type="number" min={0} value={distanciaKm} onChange={(e) => setDistanciaKm(+e.target.value)} />
              </Campo>
              <Campo label="Tiempo (minutos, solo ida)">
                <Input type="number" min={0} value={tiempoMin} onChange={(e) => setTiempoMin(+e.target.value)} />
              </Campo>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Vehículo y condiciones</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Vehículo">
                <Select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)}>
                  {vehiculos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nombre} · {v.capacidad_pasajeros} pax
                    </option>
                  ))}
                </Select>
              </Campo>
              <Campo label="Horas de espera">
                <Input type="number" min={0} step={0.5} value={horasEspera} onChange={(e) => setHorasEspera(+e.target.value)} />
              </Campo>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={incluyeRetorno} onChange={(e) => setIncluyeRetorno(e.target.checked)} />
                Incluir retorno (duplica distancia y tiempo)
              </label>
              {incluyeRetorno && (
                <label className="ml-6 flex items-center gap-2 text-slate-400">
                  <input type="checkbox" checked={duplicarPeajes} onChange={(e) => setDuplicarPeajes(e.target.checked)} />
                  Cobrar los peajes también en el retorno
                </label>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Peajes del trayecto</h2>
            {peajes.length === 0 ? (
              <p className="text-sm text-slate-500">No hay peajes cargados. Agrégalos en la sección Peajes.</p>
            ) : (
              <div className="space-y-2 text-sm">
                {peajes.map((p) => (
                  <label key={p.id} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={peajesSel.includes(p.id)}
                        onChange={(e) =>
                          setPeajesSel(e.target.checked ? [...peajesSel, p.id] : peajesSel.filter((x) => x !== p.id))
                        }
                      />
                      {p.nombre}
                    </span>
                    <span className="text-slate-400">{clp(p.valor)}</span>
                  </label>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ---------------- RESULTADO ---------------- */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <h2 className="mb-4 font-semibold">Resultado</h2>
            {!resultado ? (
              <p className="text-sm text-slate-500">Selecciona un vehículo para calcular.</p>
            ) : (
              <>
                <div className="mb-4 space-y-1 text-sm">
                  <Fila label="Distancia total" valor={`${resultado.distancia_km} km`} />
                  <Fila label="Tiempo estimado" valor={minAHoras(resultado.tiempo_estimado_min)} />
                </div>
                <div className="space-y-1 border-t border-slate-800 pt-4 text-sm">
                  <Fila label="Bencina" valor={clp(resultado.bencina_total)} />
                  <Fila label="Desgaste vehículo" valor={clp(resultado.desgaste_total)} />
                  <Fila label="Peajes" valor={clp(resultado.peajes_total)} />
                  <Fila label="Espera" valor={clp(resultado.espera_total)} />
                  <Fila label="Costo base" valor={clp(resultado.costo_base)} fuerte />
                </div>
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <Campo label={`Margen: ${margen}%`}>
                    <input
                      type="range" min={0} max={120} step={5}
                      value={margen} onChange={(e) => setMargen(+e.target.value)}
                      className="w-full accent-amber-500"
                    />
                  </Campo>
                  <div className="mt-3 space-y-1 text-sm">
                    <Fila label="Ganancia" valor={clp(resultado.margen_clp)} />
                  </div>
                  <div className="mt-4 rounded-lg bg-amber-500/10 p-4 text-center">
                    <p className="text-xs uppercase tracking-wide text-amber-400">Precio final</p>
                    <p className="text-3xl font-bold text-amber-400">{clp(resultado.precio_final)}</p>
                    {resultado.aplico_precio_minimo && (
                      <p className="mt-1 text-xs text-slate-400">Se aplicó el precio mínimo configurado</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Boton onClick={guardar} disabled={guardando} className="w-full">
                    {guardando ? 'Guardando…' : 'Guardar cotización'}
                  </Boton>
                  {contacto && (
                    <a href={textoWhatsApp()} target="_blank" rel="noreferrer"
                       className="block w-full rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-semibold hover:bg-slate-800">
                      Enviar por WhatsApp
                    </a>
                  )}
                  {mensaje && <p className="text-center text-sm text-emerald-400">{mensaje}</p>}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Fila({ label, valor, fuerte }: { label: string; valor: string; fuerte?: boolean }) {
  return (
    <div className={`flex justify-between ${fuerte ? 'font-semibold text-slate-100' : 'text-slate-400'}`}>
      <span>{label}</span>
      <span className={fuerte ? '' : 'text-slate-200'}>{valor}</span>
    </div>
  );
}