const HOOK = import.meta.env.PUBLIC_DEPLOY_HOOK_URL;

export async function publicarSitio(): Promise<void> {
  if (!HOOK) throw new Error('Falta PUBLIC_DEPLOY_HOOK_URL');
  const res = await fetch(HOOK, { method: 'POST' });
  if (!res.ok) throw new Error('No se pudo iniciar la publicación');
}