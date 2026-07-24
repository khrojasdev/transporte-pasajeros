const HOOK = import.meta.env.PUBLIC_DEPLOY_HOOK_URL;

export async function publicarSitio(): Promise<void> {
  if (!HOOK) throw new Error('Falta PUBLIC_DEPLOY_HOOK_URL');
  await fetch(HOOK, { method: 'POST', mode: 'no-cors' });
  // Con no-cors no podemos leer la respuesta, pero el POST llega igual y dispara el build.
}