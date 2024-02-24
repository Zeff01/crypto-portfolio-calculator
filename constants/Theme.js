// constants/Theme.js
import { DefaultTheme, DarkTheme } from 'react-native-paper';

export const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
        // ...DefaultTheme.colors,
        primary: '#3498db',
        accent: '#f1c40f',
        background: '#ffffff',
        text: '#333333',
        // Add more colors as needed
    },
};

export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        // ...DarkTheme.colors,
        primary: '#2980b9',
        accent: '#f39c12',
        background: '#111111',
        text: '#ecf0f1',
        // Add more colors as needed
    },
};
