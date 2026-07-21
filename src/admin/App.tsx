import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/Layout';

const Pendiente = ({ nombre }: { nombre: string }) => (
  <div>
    <h1 className="text-2xl font-bold">{nombre}</h1>
    <p className="mt-2 text-slate-400">Se construye en una fase posterior.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route element={<Layout />}>
          <Route index               element={<Pendiente nombre="Dashboard" />} />
          <Route path="calculadora"  element={<Pendiente nombre="Calculadora" />} />
          <Route path="solicitudes"  element={<Pendiente nombre="Solicitudes" />} />
          <Route path="viajes"       element={<Pendiente nombre="Viajes" />} />
          <Route path="vehiculos"    element={<Pendiente nombre="Vehículos" />} />
          <Route path="peajes"       element={<Pendiente nombre="Peajes" />} />
          <Route path="configuracion" element={<Pendiente nombre="Configuración" />} />
          <Route path="*"            element={<Pendiente nombre="Página no encontrada" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}