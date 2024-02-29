import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Button, Image } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { fetchCMCSearchResults } from '../utils/api';

const HomeScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [cryptoData, setCryptoData] = useState([]);
    console.log("cryptoData:", cryptoData)
    const [cryptoInfoData, setCryptoInfoData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);



    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchCryptoData();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }) => (
        <View style={dynamicStyles.cryptoItem}>
            <View style={dynamicStyles.cryptoNameContainer}>
                {/* Replace 'item.icon' with the actual property that holds the icon URI */}
                <Image source={{ uri: item.icon }} style={dynamicStyles.cryptoIcon} />
                <Text style={dynamicStyles.cryptoName}>{item.name}</Text>
            </View>
            <Text style={dynamicStyles.cryptoPrice}>${item.quote.USD.price.toFixed(2)}</Text>
            <Text style={[
                dynamicStyles.cryptoChange,
                item.quote.USD.percent_change_24h >= 0
                    ? dynamicStyles.cryptoChangePositive
                    : dynamicStyles.cryptoChangeNegative
            ]}>
                {item.quote.USD.percent_change_24h.toFixed(2)}%
            </Text>
        </View>
    );

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
        cryptoItem: {
            backgroundColor: 'white', // Assuming a white card background
            borderRadius: 10, // Rounded corners
            padding: 16, // Padding around the content
            flexDirection: 'row', // Layout children in a row
            alignItems: 'center', // Align items vertically
            justifyContent: 'space-between', // Space between the items
            marginBottom: 10, // Margin at the bottom of each card
            shadowColor: '#000', // Shadow to give a lifted card effect
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3, // Elevation for Android
        },
        cryptoIcon: {
            width: 30, // Icon size
            height: 30, // Icon size
            marginRight: 10, // Margin to the right of the icon
        },
        cryptoNameContainer: {
            flexDirection: 'row', // Layout children in a row
            alignItems: 'center', // Align items vertically
        },
        cryptoName: {
            fontSize: 18, // Larger font size for the name
            fontWeight: '600', // Slightly bolder than normal
            color: colors.text,
        },
        cryptoPrice: {
            fontSize: 16, // Larger font size for the price
            fontWeight: 'bold', // Bold font weight for the price
            color: colors.text,
        },
        cryptoChange: {
            fontSize: 14, // Smaller font size for the change percentage
            fontWeight: '500', // Medium boldness
            borderRadius: 5, // Rounded corners for the percentage change
            paddingVertical: 2, // Vertical padding for the change percentage
            paddingHorizontal: 6, // Horizontal padding for the change percentage
            color: 'white', // White text color
        },
        cryptoChangePositive: {
            backgroundColor: 'green', // Green background for positive change
        },
        cryptoChangeNegative: {
            backgroundColor: 'red', // Red background for negative change
        },
    });

    return (
        <View style={dynamicStyles.container}>
            <View style={dynamicStyles.topBar}>
                <Button title="Change Theme" onPress={() => console.log('Toggle theme')} color={colors.onPrimary} />
                <Button title="Logout" onPress={() => navigation.navigate('Login')} color={colors.onPrimary} />
            </View>
            <FlatList
                data={cryptoData}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={{ paddingBottom: 20 }} // Added padding at the bottom for better look
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchInput: {
        fontSize: 18,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        color: 'black', // Adjust based on your theme
        backgroundColor: 'white', // Adjust based on your theme
    },
    // Other styles...
});

export default HomeScreen;
