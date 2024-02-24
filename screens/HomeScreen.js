import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useThemeStore from '../store/useThemeStore';
import { useTheme } from 'react-native-paper';

const HomeScreen = () => {
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const { colors } = useTheme(); // This will get the current theme colors


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

    return (
        <View style={dynamicStyles.container}>
            <Button title="Toggle Theme" onPress={toggleTheme} color={colors.primary} />
            <Text style={dynamicStyles.text}>Home Screen</Text>
        </View>
    );
};

export default HomeScreen;
