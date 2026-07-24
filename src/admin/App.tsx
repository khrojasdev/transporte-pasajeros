import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/Layout';
import Login from './auth/Login';
import { useSesion } from './auth/useSesion';
import Dashboard from './dashboard/components/Dashboard';
import Calculadora from './cotizaciones/components/Calculadora';
import Solicitudes from './cotizaciones/components/Solicitudes';
import Viajes from './viajes/components/Viajes';
import DetalleViaje from './viajes/components/DetalleViaje';
import Vehiculos from './vehiculos/components/Vehiculos';
import Conductores from './vehiculos/components/Conductores';
import Peajes from './peajes/components/Peajes';
import Publicaciones from './publicaciones/components/Publicaciones';
import Configuracion from './configuracion/components/Configuracion';

export default function App() {
  const { cargando, autenticado, entrar, salir } = useSesion();

  if (cargando) return <div className="grid min-h-screen place-items-center text-slate-500">Cargando…</div>;
  if (!autenticado) return <Login onEntrar={entrar} />;

  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route element={<Layout onSalir={salir} />}>
          <Route index element={<Dashboard />} />
          <Route path="calculadora" element={<Calculadora />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="viajes" element={<Viajes />} />
          <Route path="viaje" element={<DetalleViaje />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="conductores" element={<Conductores />} />
          <Route path="peajes" element={<Peajes />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="publicaciones" element={<Publicaciones />} />
          <Route path="*" element={<p className="text-slate-400">Página no encontrada.</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}