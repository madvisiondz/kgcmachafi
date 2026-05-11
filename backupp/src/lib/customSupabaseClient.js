import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqnozojgyzzngwovqpmg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbm96b2pneXp6bmd3b3ZxcG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDE2OTMsImV4cCI6MjA2NzY3NzY5M30.t6QKEJlXEUEV1P6Owd-Gtg6DMTv17UhpUtYHfvnz6CY';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
