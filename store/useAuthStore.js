// useAuthStore.js
import { create } from 'zustand';
import { supabase } from '../services/supabase';

const useAuthStore = create((set) => ({
    session: null,
    setSession: (session) => set({ session }),
    login: (session) => set({ session }),
    logout: () => {
        set({ session: null });
        supabase.auth.signOut();
    },
}));

export default useAuthStore;
