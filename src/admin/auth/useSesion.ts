import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function useSesion() {
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAutenticado(!!data.session);
      setCargando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAutenticado(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const entrar = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Email o contraseña incorrectos');
  };

  const salir = async () => {
    await supabase.auth.signOut();
  };

  return { cargando, autenticado, entrar, salir };
}