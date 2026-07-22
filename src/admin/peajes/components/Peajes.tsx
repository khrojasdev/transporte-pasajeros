import { useEffect, useState } from 'react';
import { actualizarPeaje, crearPeaje, eliminarPeaje, listarPeajes } from '../api';
import type { Peaje } from '../types';
import { clp } from '../../shared/formato';
import { Boton, Campo, Card, Etiqueta, Input, Tabla, Titulo, Vacio } from '../../shared/ui';

export default function Peajes() {
  const [lista, setLista] = useState<Peaje[]>([]);
  const [nombre, setNombre] = useState('');
  const [valor, setValor] = useState(0);

  const cargar = () => listarPeajes().then(setLista);
  useEffect(() => { cargar(); }, []);

  const agregar = async () => {
    if (!nombre || valor <= 0) return;
    await crearPeaje({ nombre, valor, activo: true });
    setNombre(''); setValor(0);
    cargar();
  };

  return (
    <div>
      <Titulo>Peajes</Titulo>

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Agregar peaje</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[240px] flex-1">
            <Campo label="Nombre del tramo">
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ruta 68 — Lo Prado" />
            </Campo>
          </div>
          <div className="w-40">
            <Campo label="Valor (CLP)">
              <Input type="number" value={valor} onChange={(e) => setValor(+e.target.value)} />
            </Campo>
          </div>
          <Boton onClick={agregar}>Agregar</Boton>
        </div>
      </Card>

      {lista.length === 0 ? (
        <Vacio mensaje="Aún no hay peajes cargados." />
      ) : (
        <Tabla cabeceras={['Tramo', 'Valor', 'Estado', '']}>
          {lista.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3">{p.nombre}</td>
              <td className="px-4 py-3">{clp(p.valor)}</td>
              <td className="px-4 py-3">
                <Etiqueta texto={p.activo ? 'Activo' : 'Inactivo'} color={p.activo ? 'verde' : 'gris'} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Boton variante="secundario" onClick={async () => { await actualizarPeaje(p.id, { activo: !p.activo }); cargar(); }}>
                    {p.activo ? 'Desactivar' : 'Activar'}
                  </Boton>
                  <Boton variante="peligro" onClick={async () => { await eliminarPeaje(p.id); cargar(); }}>Eliminar</Boton>
                </div>
              </td>
            </tr>
          ))}
        </Tabla>
      )}
    </div>
  );
}