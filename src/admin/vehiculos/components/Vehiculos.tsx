import { useEffect, useState } from 'react';
import {
  actualizarVehiculo, crearDocumento, crearVehiculo, eliminarDocumento,
  eliminarVehiculo, listarDocumentos, listarVehiculos,
} from '../api';
import { TIPOS_DOCUMENTO, type DocumentoVehiculo, type Vehiculo } from '../types';
import { clp } from '../../shared/formato';
import { Boton, Campo, Card, Etiqueta, Input, Select, Tabla, Titulo, Vacio } from '../../shared/ui';

const vacio = { nombre: '', patente: '', rendimiento_l_100km: 10, costo_desgaste_km: 100, capacidad_pasajeros: 4 };

export default function Vehiculos() {
  const [lista, setLista] = useState<Vehiculo[]>([]);
  const [docs, setDocs] = useState<DocumentoVehiculo[]>([]);
  const [form, setForm] = useState(vacio);
  const [docForm, setDocForm] = useState({ vehiculo_id: '', tipo: 'revision_tecnica', fecha_vencimiento: '' });

  const cargar = async () => {
    setLista(await listarVehiculos());
    setDocs(await listarDocumentos());
  };
  useEffect(() => { cargar(); }, []);

  const agregar = async () => {
    if (!form.nombre) return;
    await crearVehiculo({ ...form, activo: true });
    setForm(vacio);
    cargar();
  };

  const agregarDoc = async () => {
    if (!docForm.vehiculo_id || !docForm.fecha_vencimiento) return;
    await crearDocumento({ ...docForm, tipo: docForm.tipo as DocumentoVehiculo['tipo'], notas: null });
    setDocForm({ vehiculo_id: '', tipo: 'revision_tecnica', fecha_vencimiento: '' });
    cargar();
  };

  const diasRestantes = (f: string) => Math.ceil((new Date(f).getTime() - Date.now()) / 86400000);

  return (
    <div>
      <Titulo>Vehículos</Titulo>

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Agregar vehículo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Nombre">
            <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Hyundai H1" />
          </Campo>
          <Campo label="Patente">
            <Input value={form.patente} onChange={(e) => setForm({ ...form, patente: e.target.value.toUpperCase() })} />
          </Campo>
          <Campo label="Capacidad (pasajeros)">
            <Input type="number" value={form.capacidad_pasajeros} onChange={(e) => setForm({ ...form, capacidad_pasajeros: +e.target.value })} />
          </Campo>
          <Campo label="Rendimiento (L/100 km)" hint="Consumo real, no el de catálogo">
            <Input type="number" step={0.1} value={form.rendimiento_l_100km} onChange={(e) => setForm({ ...form, rendimiento_l_100km: +e.target.value })} />
          </Campo>
          <Campo label="Desgaste (CLP/km)" hint="Mantención + depreciación estimadas">
            <Input type="number" value={form.costo_desgaste_km} onChange={(e) => setForm({ ...form, costo_desgaste_km: +e.target.value })} />
          </Campo>
          <div className="flex items-end">
            <Boton onClick={agregar} className="w-full">Agregar vehículo</Boton>
          </div>
        </div>
      </Card>

      {lista.length === 0 ? <Vacio mensaje="Sin vehículos." /> : (
        <Tabla cabeceras={['Vehículo', 'Patente', 'Pax', 'Rendimiento', 'Desgaste', 'Estado', '']}>
          {lista.map((v) => (
            <tr key={v.id}>
              <td className="px-4 py-3">{v.nombre}</td>
              <td className="px-4 py-3 text-slate-400">{v.patente}</td>
              <td className="px-4 py-3">{v.capacidad_pasajeros}</td>
              <td className="px-4 py-3">{v.rendimiento_l_100km} L/100km</td>
              <td className="px-4 py-3">{clp(v.costo_desgaste_km)}/km</td>
              <td className="px-4 py-3"><Etiqueta texto={v.activo ? 'Activo' : 'Inactivo'} color={v.activo ? 'verde' : 'gris'} /></td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Boton variante="secundario" onClick={async () => { await actualizarVehiculo(v.id, { activo: !v.activo }); cargar(); }}>
                    {v.activo ? 'Desactivar' : 'Activar'}
                  </Boton>
                  <Boton variante="peligro" onClick={async () => { await eliminarVehiculo(v.id); cargar(); }}>Eliminar</Boton>
                </div>
              </td>
            </tr>
          ))}
        </Tabla>
      )}

      <h2 className="mb-4 mt-10 text-lg font-semibold">Documentos con vencimiento</h2>
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px]">
            <Campo label="Vehículo">
              <Select value={docForm.vehiculo_id} onChange={(e) => setDocForm({ ...docForm, vehiculo_id: e.target.value })}>
                <option value="">Selecciona…</option>
                {lista.map((v) => <option key={v.id} value={v.id}>{v.nombre}</option>)}
              </Select>
            </Campo>
          </div>
          <div className="min-w-[200px]">
            <Campo label="Tipo">
              <Select value={docForm.tipo} onChange={(e) => setDocForm({ ...docForm, tipo: e.target.value })}>
                {TIPOS_DOCUMENTO.map((t) => <option key={t.valor} value={t.valor}>{t.label}</option>)}
              </Select>
            </Campo>
          </div>
          <div>
            <Campo label="Vence el">
              <Input type="date" value={docForm.fecha_vencimiento} onChange={(e) => setDocForm({ ...docForm, fecha_vencimiento: e.target.value })} />
            </Campo>
          </div>
          <Boton onClick={agregarDoc}>Agregar</Boton>
        </div>
      </Card>

      {docs.length === 0 ? <Vacio mensaje="Sin documentos registrados." /> : (
        <Tabla cabeceras={['Vehículo', 'Documento', 'Vence', 'Días', '']}>
          {docs.map((d) => {
            const dias = diasRestantes(d.fecha_vencimiento);
            const color = dias < 7 ? 'rojo' : dias < 30 ? 'ambar' : 'verde';
            return (
              <tr key={d.id}>
                <td className="px-4 py-3">{lista.find((v) => v.id === d.vehiculo_id)?.nombre ?? '—'}</td>
                <td className="px-4 py-3">{TIPOS_DOCUMENTO.find((t) => t.valor === d.tipo)?.label}</td>
                <td className="px-4 py-3">{new Date(d.fecha_vencimiento).toLocaleDateString('es-CL')}</td>
                <td className="px-4 py-3"><Etiqueta texto={dias < 0 ? 'Vencido' : `${dias} días`} color={dias < 0 ? 'rojo' : color} /></td>
                <td className="px-4 py-3 text-right">
                  <Boton variante="peligro" onClick={async () => { await eliminarDocumento(d.id); cargar(); }}>Eliminar</Boton>
                </td>
              </tr>
            );
          })}
        </Tabla>
      )}
    </div>
  );
}