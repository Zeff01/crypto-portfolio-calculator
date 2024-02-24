import { create } from 'zustand';

const useAuthStore = create((set) => ({
    authToken: null,
    login: (token) => set({ authToken: token }),
    logout: () => set({ authToken: null }),
}));

export default useAuthStore;
