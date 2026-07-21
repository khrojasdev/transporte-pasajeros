import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// En Fase 5 estas variables tendrán valores reales.
export const supabase = createClient(url ?? 'http://localhost', key ?? 'anon');