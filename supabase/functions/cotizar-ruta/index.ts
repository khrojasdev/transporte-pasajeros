import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const clave = Deno.env.get('GEOAPIFY_API_KEY');
  if (!clave) return json({ error: 'Falta GEOAPIFY_API_KEY' }, 500);

  try {
    const cuerpo = await req.json();

    // MODO 1: geocodificar una dirección → coordenadas
    if (cuerpo.direccion) {
      const url = new URL('https://api.geoapify.com/v1/geocode/search');
      url.searchParams.set('text', cuerpo.direccion);
      url.searchParams.set('filter', 'countrycode:cl');
      url.searchParams.set('lang', 'es');
      url.searchParams.set('limit', '5');
      url.searchParams.set('apiKey', clave);
      const r = await fetch(url);
      const data = await r.json();
      return json({
        resultados: (data.features ?? []).map((f: any) => ({
          etiqueta: f.properties.formatted,
          coordenadas: [f.properties.lon, f.properties.lat], // [lng, lat]
        })),
      });
    }

    // MODO 2: calcular ruta con múltiples paradas
    const { coordenadas } = cuerpo;
    if (!Array.isArray(coordenadas) || coordenadas.length < 2)
      return json({ error: 'Se requieren al menos origen y destino' }, 400);

    // Geoapify espera "lat,lon|lat,lon|..." (lat primero)
    const waypoints = coordenadas.map(([lng, lat]: [number, number]) => `${lat},${lng}`).join('|');
    const url = new URL('https://api.geoapify.com/v1/routing');
    url.searchParams.set('waypoints', waypoints);
    url.searchParams.set('mode', 'drive');
    url.searchParams.set('apiKey', clave);

    const r = await fetch(url);
    const data = await r.json();
    const props = data.features?.[0]?.properties;
    if (!props) return json({ error: 'No se pudo calcular la ruta', detalle: data }, 502);

    return json({
      distancia_km: +(props.distance / 1000).toFixed(1),
      tiempo_min: Math.round(props.time / 60),
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});