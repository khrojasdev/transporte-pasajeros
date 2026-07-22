import { useEffect, useState } from 'react';
import { obtenerConfiguracion, guardarConfiguracion } from '../api';
import type { Configuracion as Config } from '../types';
import { Boton, Campo, Card, Input, Titulo } from '../../shared/ui';

export default function Configuracion() {
  const [c, setC] = useState<Config | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { obtenerConfiguracion().then(setC); }, []);
  if (!c) return <p className="text-slate-400">Cargando…</p>;

  const set = (k: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setC({ ...c, [k]: +e.target.value });

  return (
    <div>
      <Titulo>Configuración</Titulo>
      <Card className="max-w-lg">
        <div className="space-y-4">
          <Campo label="Precio del litro de combustible (CLP)" hint="Actualízalo cuando cambie el precio en la bomba">
            <Input type="number" value={c.precio_litro} onChange={set('precio_litro')} />
          </Campo>
          <Campo label="Margen por defecto (%)">
            <Input type="number" value={c.margen_defecto} onChange={set('margen_defecto')} />
          </Campo>
          <Campo label="Tarifa por hora de espera (CLP)" hint="Se cobra en eventos, conciertos y comidas">
            <Input type="number" value={c.tarifa_hora_espera} onChange={set('tarifa_hora_espera')} />
          </Campo>
          <Campo label="Precio mínimo por viaje (CLP)" hint="Ningún traslado se cotiza bajo este valor">
            <Input type="number" value={c.precio_minimo} onChange={set('precio_minimo')} />
          </Campo>
          <Boton onClick={async () => { await guardarConfiguracion(c); setMsg('Guardado ✔'); }}>
            Guardar
          </Boton>
          {msg && <p className="text-sm text-emerald-400">{msg}</p>}
        </div>
      </Card>
    </div>
  );
}