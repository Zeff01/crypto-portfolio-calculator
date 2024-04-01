// useAuthStore.js
import { create } from 'zustand';
// import { supabase } from '../services/supabase';

const useAuthStore = create((set) => ({
    session: null,
    user: null,

    setUser: (user) => set({user}),
    setSession: (session) => set({ session }),
    login: (session, user) => set({ session, user }),
    logout: () => {
        set({ session: null });
        set({ user: null });
        // supabase.auth.signOut();
    },
}));

export default useAuthStore;
