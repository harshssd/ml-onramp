import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase';

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    persistSession: true,
    storage: require('@react-native-async-storage/async-storage').default,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
