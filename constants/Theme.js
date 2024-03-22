// constants/Theme.js
import { DefaultTheme, DarkTheme } from 'react-native-paper';

export const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
        primary: '#3498db',
        secondary: '#ffffff',
        accent: '#f1c40f',
        background: '#e1f8f3',
        surface: '#ffffff',
        text: '#1E1E1E',
        disabled: '#f0f0f0',
        placeholder: '#cccccc',
        backdrop: '#f0f0f0',
        onSurface: '#333333',
        onBackground: '#333333',
        notification: '#ff5252',
        button: '#1E1E1E',
        icon: '#1E1E1E',
        card: '#ffffff',
        coincard: '#ffffff',
        coin : '#ffffff'
    },
};


export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        primary: '#2980b9',
        secondary: 'rgba( 43, 43, 43, 0.5)',
        accent: '#f39c12',
        background: '#00271f',
        surface: '#333333',
        text: '#FFFFFF',
        disabled: '#424242',
        placeholder: '#cccccc',
        backdrop: '#212121',
        onSurface: '#FFFFFF',
        onBackground: '#ECEFF1',
        notification: '#ff80ab',
        button: '#FFFFFF',
        icon: '#02F5C3',
        card: 'rgba(195, 195, 195, 0.1)',
        coincard: '#232726',
        coin : 'rgba(30, 30, 30, 0.5)',
    },
};
