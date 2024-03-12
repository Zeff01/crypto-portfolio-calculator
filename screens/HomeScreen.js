import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { fetchCMCGlobalMetrics, fetchLatestContent, fetchTrendingTokens, fetchGainersAndLosers } from '../utils/api';
import CryptoMetricsUI from '../components/CryptoMetrcisUi';
import { CategoriesList } from '../components/CategoryList';
import Banner from '../components/home/Banner';
import News from '../components/home/News';
import Coins from '../components/home/Coins';
import { supabase } from '../services/supabase';

const HomeScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [cryptoData, setCryptoData] = useState([]);
    const [cryptoNews, setCryptoNews] = useState()
    const [cryptoTrending, setCryptoTrending] = useState()
    const [cryptoGainers, setCryptoGainers] = useState()
    console.log("zz  HomeScreen  cryptoGainers:", cryptoGainers)
    const [refreshing, setRefreshing] = useState(false);
    const [username, setUserName] = useState('')

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
            setCryptoTrending(data);
        }
    };

    // const fetchGainersLosers = async () => {
    //     const data = await fetchTrendingTokens();
    //     if (data) {
    //         setCryptoGainers(data);
    //     }
    // };

    
    // const fetchLatestNews = async () => {
    //     const data = await fetchLatestContent();
    //     if (data) {
    //         setCryptoNews(data.data);
    //     }
    // };

    // const fetchCategory = async () => {
    //     const data = await fetchLatestContent();
    //     if (data) {
    //         setCategory(data.data);
    //     }
    // };
    // const fetchCategories = async () => {
    //     const data = await fetchLatestContent();
    //     if (data) {
    //         setCategories(data.data);
    //     }
    // };

      //check if paid already
      const checkUserPaymentStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data, error } = await supabase
                .from('subscription')
                .select('username')
                .eq('userId', user.id)
                .single();
                setUserName( data.username)


            if (error) {
                console.error('Error fetching user data:', error);
                return;
            }
        }
    };

    useEffect(() => {
        // fetchCategory()
        // fetchCategories()
        // fetchLatestNews()
        fetchGainersLosers()
        fetchTrendingToken()
        fetchCryptoData();
        checkUserPaymentStatus()
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
            <Banner username={username} />
            {/* <News data={cryptoNews} /> */}
            <Coins title={'trending coins'} data={cryptoTrending} />
            
            {/* <Coins title={'Gainers'} data={cryptoGainers} /> */}
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
