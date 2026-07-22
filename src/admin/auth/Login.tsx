import { useState } from 'react';
import { Boton, Campo, Card, Input } from '../shared/ui';

export default function Login({ onEntrar }: { onEntrar: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviar = async () => {
    setError('');
    setCargando(true);
    try {
      await onEntrar(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold">Panel de administración</h1>
        <p className="mb-6 text-sm text-slate-400">Acceso privado</p>
        <div className="space-y-4">
          <Campo label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </Campo>
          <Campo label="Contraseña">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && enviar()}
            />
          </Campo>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Boton onClick={enviar} disabled={cargando} className="w-full">
            {cargando ? 'Entrando…' : 'Entrar'}
          </Boton>
        </div>
      </Card>
    </div>
  );
}