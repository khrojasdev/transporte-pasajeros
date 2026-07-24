import { useEffect, useState } from 'react';
import {
  actualizarPublicacion, crearPublicacion, eliminarPublicacion,
  listarPublicaciones, subirImagen,
} from '../api';
import type { Publicacion } from '../types';
import { Boton, Campo, Card, Etiqueta, Input, Titulo, Vacio } from '../../shared/ui';

const vacio = { titulo: '', descripcion: '', fecha_evento: '' };

export default function Publicaciones() {
  const [lista, setLista] = useState<Publicacion[]>([]);
  const [form, setForm] = useState(vacio);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const cargar = () => listarPublicaciones().then(setLista);
  useEffect(() => { cargar(); }, []);

  const agregar = async () => {
    setError(''); setMsg('');
    if (!form.titulo || !form.descripcion) {
      setError('Completa título y descripción.');
      return;
    }
    setSubiendo(true);
    try {
      let imagen_url: string | null = null;
      if (archivo) imagen_url = await subirImagen(archivo);
      await crearPublicacion({
        titulo: form.titulo,
        descripcion: form.descripcion,
        fecha_evento: form.fecha_evento || null,
        imagen_url,
        activa: true,
      });
      setForm(vacio);
      setArchivo(null);
      setMsg('Publicación creada. No olvides "Publicar cambios en el sitio".');
      cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear la publicación');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div>
      <Titulo>Ofertas y eventos</Titulo>

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Nueva publicación</h2>
        <div className="space-y-4">
          <Campo label="Título" hint="Ej: Traslados especiales Lollapalooza 2026">
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </Campo>
          <Campo label="Descripción">
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-500"
            />
          </Campo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Fecha del evento" hint="Opcional">
              <Input type="date" value={form.fecha_evento} onChange={(e) => setForm({ ...form, fecha_evento: e.target.value })} />
            </Campo>
            <Campo label="Imagen / flyer" hint="JPG o PNG">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
              />
            </Campo>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {msg && <p className="text-sm text-emerald-400">{msg}</p>}
          <Boton onClick={agregar} disabled={subiendo}>
            {subiendo ? 'Guardando…' : 'Crear publicación'}
          </Boton>
        </div>
      </Card>

      {lista.length === 0 ? (
        <Vacio mensaje="Aún no hay publicaciones." />
      ) : (
        <div className="space-y-4">
          {lista.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-start gap-4">
                {p.imagen_url && (
                  <img src={p.imagen_url} alt={p.titulo} className="h-24 w-24 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{p.titulo}</h3>
                    <Etiqueta texto={p.activa ? 'Visible' : 'Oculta'} color={p.activa ? 'verde' : 'gris'} />
                  </div>
                  {p.fecha_evento && (
                    <p className="mt-1 text-xs text-slate-400">
                      Evento: {new Date(p.fecha_evento + 'T00:00').toLocaleDateString('es-CL')}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-slate-300">{p.descripcion}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Boton variante="secundario" onClick={async () => { await actualizarPublicacion(p.id, { activa: !p.activa }); cargar(); }}>
                    {p.activa ? 'Ocultar' : 'Mostrar'}
                  </Boton>
                  <Boton variante="peligro" onClick={async () => { await eliminarPublicacion(p.id); cargar(); }}>
                    Eliminar
                  </Boton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}