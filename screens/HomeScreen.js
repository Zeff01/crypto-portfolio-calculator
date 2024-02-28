import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Button } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using react-navigation

const HomeScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    // Dummy data for cryptocurrencies
    const cryptoData = [
        { id: 1, name: 'Bitcoin', symbol: 'BTC', price: '45,000', change: '2.5%' },
        { id: 2, name: 'Ethereum', symbol: 'ETH', price: '3,000', change: '-1.2%' },
        { id: 3, name: 'Cardano', symbol: 'ADA', price: '2.15', change: '5.0%' },
        // Add more cryptocurrencies as needed
    ];

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Here, you would fetch or refresh your data
        console.log('Data refreshed');
        setRefreshing(false);
    }, []);

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        topBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: colors.primary,
        },
        content: {
            padding: 20,
        },
        cryptoItem: {
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
        },
        cryptoName: {
            fontSize: 16,
            color: colors.text,
        },
        cryptoPrice: {
            fontSize: 14,
            color: colors.text,
        },
        cryptoChange: {
            fontSize: 14,
            color: colors.text,
        },
    });

    return (
        <ScrollView
            style={dynamicStyles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={dynamicStyles.topBar}>
                <Button title="Change Theme" onPress={() => console.log('Toggle theme')} color={colors.onPrimary} />
                <Button title="Logout" onPress={() => navigation.navigate('Login')} color={colors.onPrimary} />
            </View>
            <View style={dynamicStyles.content}>
                {cryptoData.map((crypto) => (
                    <View key={crypto.id} style={dynamicStyles.cryptoItem}>
                        <Text style={dynamicStyles.cryptoName}>{crypto.name} ({crypto.symbol})</Text>
                        <Text style={dynamicStyles.cryptoPrice}>Price: ${crypto.price}</Text>
                        <Text style={dynamicStyles.cryptoChange}>24h Change: {crypto.change}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
