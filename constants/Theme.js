// constants/Theme.js
import { DefaultTheme, DarkTheme } from 'react-native-paper';

export const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
        primary: '#3498db',
        accent: '#f1c40f',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#333333',
        disabled: '#f0f0f0',
        placeholder: '#cccccc',
        backdrop: '#f0f0f0',
        onSurface: '#333333',
        onBackground: '#333333',
        notification: '#ff5252',
    },
};


export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        primary: '#2980b9',
        accent: '#f39c12',
        background: '#111111',
        surface: '#333333',
        text: '#ecf0f1',
        disabled: '#424242',
        placeholder: '#cccccc',
        backdrop: '#212121',
        onSurface: '#FFFFFF',
        onBackground: '#ECEFF1',
        notification: '#ff80ab',
    },
};
