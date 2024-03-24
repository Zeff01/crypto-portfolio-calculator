import { CustomDarkTheme, CustomLightTheme } from "../constants/Theme";
import useThemeStore from "../store/useThemeStore";

export const useHandleTheme = () => {
  const { theme, toggleTheme } = useThemeStore();
  const colors =
    theme === "dark" ? CustomDarkTheme.colors : CustomLightTheme.colors;
  return { colors, toggleTheme, theme };
};
