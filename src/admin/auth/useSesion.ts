import { useEffect, useState } from 'react';

const CLAVE = 'transporte:sesion';

export function useSesion() {
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    setAutenticado(window.localStorage.getItem(CLAVE) === '1');
    setCargando(false);
  }, []);

  const entrar = async (email: string, password: string) => {
    // MOCK: cualquier email/clave no vacíos sirven. Se reemplaza por Supabase Auth en la Fase 5.
    if (!email || !password) throw new Error('Ingresa email y contraseña');
    window.localStorage.setItem(CLAVE, '1');
    setAutenticado(true);
  };

  const salir = async () => {
    window.localStorage.removeItem(CLAVE);
    setAutenticado(false);
  };

  return { cargando, autenticado, entrar, salir };
}