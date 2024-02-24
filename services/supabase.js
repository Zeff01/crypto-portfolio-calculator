// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://isfrtwqvpykkwfrpcmjy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZnJ0d3F2cHlra3dmcnBjbWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3ODg3NzAsImV4cCI6MjAyNDM2NDc3MH0.b9-urLONFJ50eu3OsW0Xr94yHjzRSwsYivNHn2R5lSI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
