import { createClient } from '@supabase/supabase-js'
import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'


// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
// const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY

const supabaseUrl = 'https://isfrtwqvpykkwfrpcmjy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZnJ0d3F2cHlra3dmcnBjbWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3ODg3NzAsImV4cCI6MjAyNDM2NDc3MH0.b9-urLONFJ50eu3OsW0Xr94yHjzRSwsYivNHn2R5lSI'

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})
