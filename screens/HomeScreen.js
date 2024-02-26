import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useThemeStore from '../store/useThemeStore';
import { useTheme } from 'react-native-paper';
import { supabase } from '../services/supabase';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    // const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const { colors, currentTheme, toggleTheme } = useTheme() // This will get the current theme colors
    const navigation = useNavigation()

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        text: {
            fontSize: 18,
            color: colors.text,
        },
    });

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout failed:', error.message);
        } else {
            console.log('Successfully logged out');
            navigation.navigate('Login')
        }
    };

    return (
        <View style={dynamicStyles.container}>
            <Button title="Toggle Theme" onPress={toggleTheme} color={colors.primary} />
            <Text style={dynamicStyles.text}>Home Screen</Text>
            <Button title="Logout" onPress={handleLogout} color={colors.accent} />
        </View>
    );
};

export default HomeScreen;
