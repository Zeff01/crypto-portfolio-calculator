import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { fetchCMCGlobalMetrics, fetchLatestContent, fetchTrendingTokens } from '../utils/api';
import CryptoMetricsUI from '../components/CryptoMetrcisUi';
import { CategoriesList } from '../components/CategoryList';
import Banner from '../components/home/Banner';
import News from '../components/home/News';
import Coins from '../components/home/Coins';

const HomeScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [cryptoData, setCryptoData] = useState([]);
    const [cryptoNews, setCryptoNews] = useState()
    const [cryptoTrending, setCryptoTrending] = useState()
    const [refreshing, setRefreshing] = useState(false);

    const [category, setCategory] = useState()
    const [categories, setCategories] = useState()

    const fetchCryptoData = async () => {
        const data = await fetchCMCGlobalMetrics();
        if (data) {
            setCryptoData(data.data);
        }
    };
    const fetchTrendingToken = async () => {
        const data = await fetchTrendingTokens();
        if (data) {
            setCryptoTrending(data.data);
        }
    };
    const fetchLatestNews = async () => {
        const data = await fetchLatestContent();
        if (data) {
            setCryptoNews(data.data);
        }
    };

    const fetchCategory = async () => {
        const data = await fetchLatestContent();
        if (data) {
            setCategory(data.data);
        }
    };
    const fetchCategories = async () => {
        const data = await fetchLatestContent();
        if (data) {
            setCategories(data.data);
        }
    };

    useEffect(() => {
        fetchCategory()
        fetchCategories()
        fetchLatestNews()
        fetchTrendingToken()
        fetchCryptoData();
    }, []);


    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchCryptoData();
        setRefreshing(false);
    }, []);


    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            gap: 10,
            paddingBottom: 10
        },
        topBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: colors.primary,
        },
        cryptoItem: {
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        cryptoIcon: {
            width: 30,
            height: 30,
            marginRight: 10,
        },
        cryptoNameContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        cryptoName: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
        },
        cryptoPrice: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
        },
        cryptoChange: {
            fontSize: 14,
            fontWeight: '500', // Medium boldness
            borderRadius: 5,
            paddingVertical: 2,
            paddingHorizontal: 6,
            color: 'white',
        },
        cryptoChangePositive: {
            backgroundColor: 'green',
        },
        cryptoChangeNegative: {
            backgroundColor: 'red',
        },
    });

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            navigation.navigate('Login');
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };
    const renderTrendingItem = ({ item }) => (
        <TouchableOpacity style={styles.trendingItem} onPress={() => console.log('Trending coin pressed', item)}>
            <Text style={styles.trendingName}>{item.name}</Text>
            <Text style={styles.trendingSymbol}>{item.symbol}</Text>
            <Text style={styles.trendingRank}>Rank: {item.cmc_rank}</Text>
        </TouchableOpacity>
    );

    const renderNewsItem = ({ item }) => (
        <View style={styles.newsItem}>
            <Image source={{ uri: item.cover }} style={styles.newsImage} />
            <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsSubtitle}>{item.subtitle}</Text>
                <Text style={styles.newsSource}>Source: {item.source_name}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView
            contentContainerStyle={[dynamicStyles.container, { backgroundColor: '#f9f9f9' }]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >

            <CryptoMetricsUI data={cryptoData} />
            <Banner username={'zeff'} />
            <News data={cryptoNews} />
            <Coins title={'trending coins'} data={cryptoTrending} />
            
            <Coins title={'new coins'} data={cryptoTrending} />
        </ScrollView>
    );
};


const styles = StyleSheet.create({

    trendingItem: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    trendingName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    trendingSymbol: {
        fontSize: 14,
        color: 'grey',
    },
    trendingRank: {
        fontSize: 12,
        color: 'blue',
        marginTop: 4,
    },

    newsItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    newsImage: {
        width: '100%',
        height: 200,
    },
    newsContent: {
        padding: 16,
    },
    newsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    newsSubtitle: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    newsSource: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        fontStyle: 'italic',
    },

});

export default HomeScreen;
