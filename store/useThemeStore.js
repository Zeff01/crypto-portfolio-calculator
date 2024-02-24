import { create } from 'zustand';

const useThemeStore = create((set) => ({
    theme: 'light', // Default theme
    toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));

export default useThemeStore;
