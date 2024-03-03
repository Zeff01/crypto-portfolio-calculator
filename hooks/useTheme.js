import { CustomDarkTheme, CustomLightTheme } from "../constants/Theme";
import { useStore } from "zustand";

export const useTheme = () => {
    const { theme, toggleTheme: toggleStoreTheme } = useStore();

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        toggleStoreTheme();
        return nextTheme;
    };
    const colors = theme === 'dark' ? CustomDarkTheme.colors : CustomLightTheme.colors;
    return { colors, currentTheme: theme, toggleTheme }
}