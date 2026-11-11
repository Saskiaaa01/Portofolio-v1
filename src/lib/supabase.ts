import { createClient } from '@supabase/supabase-js'

export const supabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

// Kunci anon memang publik; keamanan data dijaga oleh RLS di supabase/schema.sql
export const supabase = supabaseConfigured ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY) : null
