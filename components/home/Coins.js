import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import icon1 from '../../assets/images/bitcoin.png';
import icon2 from '../../assets/images/ethereum.png';
import { FlatList } from 'react-native-gesture-handler';

dummyCoins = [
    {
        name : 'Bitcoin',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
    {
        name : 'Ethereum',
        price : 2509.75,
        growth : 9.77,
        icon : icon2
    },
    {
        name : 'Tether',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
    {
        name : 'Solana',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
    {
        name : 'Binance Coin',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
    {
        name : 'XRP',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
    {
        name : 'U.S Dollar Coin',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
    {
        name : 'Cardano',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
    {
        name : 'Avalanche',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
    {
        name : 'Dogecoin',
        price : 2509.75,
        growth : 9.77,
        icon : icon1
    },
]

const styles = StyleSheet.create({
    container: {
        flex : 1,
        marginLeft: 25, 
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        textTransform: 'capitalize'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 110,
        elevation: 5,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginRight: 10
    },
      iconContainer: {
        marginRight: 10,
      },
      icon: {
        width: 50,
        height: 50,
      },
      coinNameContainer: {
        flex: 1,
        marginRight: 10,
      },
      coinName: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      priceContainer: {
        marginRight: 10,
      },
      price: {
        fontSize: 16,
      },
      growth: {
        color: 'green', // Adjust color as per growth status
        fontSize: 16,
      },
    });

const Coins = ({ title, data }) => {
    console.log(`trending: ${data}`)

    const renderCoin = ({ item }) => {

        return (
            <View style={styles.item}>
                <View style={styles.iconContainer}>
                    <Image
                        source={item.icon}
                        style={styles.icon}
                    />
                    <Text style={styles.coinName}>{item.name}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                </View>
                <View style={styles.growthContainer}>
                    <Text style={styles.growth}>{item.growth}</Text>
                </View>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <FlatList
                data={dummyCoins}
                renderItem={renderCoin}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </SafeAreaView>
    )
}

export default Coins