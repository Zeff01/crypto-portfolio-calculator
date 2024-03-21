import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        textTransform: 'capitalize',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 80,
        backgroundColor: '#232726',
        borderRadius: 10,
        marginRight: 10,
    },
    iconContainer: {
        marginRight: 10,
    },
    icon: {
        width: 40,
        height: 40,
    },
    coinNameContainer: {
        flex: 1,
    },
    coinName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
    },
    priceContainer: {
        marginRight: 9,
    },
    price: {
        fontSize: 16,
        fontWeight: '400',
        color: '#ffffff',
    },
    growth: {
        // This will be set dynamically based on growth
        fontSize: 12,
    },
    growthContainer: {
        flex: 1,
        alignItems: 'flex-end', // Align growth to the right
    }
});

const Coins = ({ title, data }) => {
    const renderCoin = ({ item }) => {
        const growthColor = item.quote.USD.percent_change_1h > 0 ? '#02F5C3' : '#FF2E2E';
        return (
            <TouchableOpacity style={styles.item} onPress={() => console.log('Navigate to coin data page')}>
                <View style={styles.iconContainer}>
                    <Image
                        source={{ uri: item.iconUrl }}
                        style={styles.icon}
                    />
                </View>
                <View style={styles.coinNameContainer}>
                    <Text style={styles.coinName}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.price}>${item.quote.USD.price.toFixed(2)}</Text>
                        <Text style={[styles.growth, { color: growthColor, marginLeft: 10 }]}>
                        {item.quote.USD.percent_change_1h.toFixed(2)}%
                    </Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <FlatList
                data={data}
                renderItem={renderCoin}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default Coins;
