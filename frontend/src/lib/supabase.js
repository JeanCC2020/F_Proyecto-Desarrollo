import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lixueunlfxaabtyxqgii.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || ''; // Se recomienda usar variables de entorno en el frontend también

export const supabase = createClient(supabaseUrl, supabaseKey);
