import { CustomDarkTheme, CustomLightTheme } from "../constants/Theme";

export const useTheme = () => {
    const { theme, setTheme } = React.useState('light');

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);

        const colors  = theme === 'dark' ? CustomDarkTheme : CustomLightTheme;
        console.log('clicking');
        return { colors, currentTheme: theme, toggleTheme }
    };
}