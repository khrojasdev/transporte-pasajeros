import { useEffect, useState } from 'react';
import { crearConductor, eliminarConductor, listarConductores } from '../api';
import type { Conductor } from '../types';
import { Boton, Campo, Card, Input, Tabla, Titulo, Vacio } from '../../shared/ui';

const vacio = { nombre: '', telefono: '', numero_licencia: '', tipo_licencia: 'A2', vencimiento_licencia: '' };

export default function Conductores() {
  const [lista, setLista] = useState<Conductor[]>([]);
  const [form, setForm] = useState(vacio);

  const cargar = () => listarConductores().then(setLista);
  useEffect(() => { cargar(); }, []);

  const agregar = async () => {
    if (!form.nombre) return;
    await crearConductor({ ...form, vencimiento_licencia: form.vencimiento_licencia || null, activo: true });
    setForm(vacio);
    cargar();
  };

  return (
    <div>
      <Titulo>Conductores</Titulo>
      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Nombre"><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Campo>
          <Campo label="Teléfono"><Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></Campo>
          <Campo label="N° licencia"><Input value={form.numero_licencia} onChange={(e) => setForm({ ...form, numero_licencia: e.target.value })} /></Campo>
          <Campo label="Tipo licencia" hint="A2/A3 para transporte de pasajeros"><Input value={form.tipo_licencia} onChange={(e) => setForm({ ...form, tipo_licencia: e.target.value })} /></Campo>
          <Campo label="Vence el"><Input type="date" value={form.vencimiento_licencia} onChange={(e) => setForm({ ...form, vencimiento_licencia: e.target.value })} /></Campo>
          <div className="flex items-end"><Boton onClick={agregar} className="w-full">Agregar conductor</Boton></div>
        </div>
      </Card>

      {lista.length === 0 ? <Vacio mensaje="Sin conductores registrados." /> : (
        <Tabla cabeceras={['Nombre', 'Teléfono', 'Licencia', 'Vence', '']}>
          {lista.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3">{c.nombre}</td>
              <td className="px-4 py-3 text-slate-400">{c.telefono}</td>
              <td className="px-4 py-3">{c.tipo_licencia} · {c.numero_licencia}</td>
              <td className="px-4 py-3">{c.vencimiento_licencia ? new Date(c.vencimiento_licencia).toLocaleDateString('es-CL') : '—'}</td>
              <td className="px-4 py-3 text-right">
                <Boton variante="peligro" onClick={async () => { await eliminarConductor(c.id); cargar(); }}>Eliminar</Boton>
              </td>
            </tr>
          ))}
        </Tabla>
      )}
    </div>
  );
}