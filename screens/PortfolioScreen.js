import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Modal, AppState, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import CoinCard from '../components/CoinCard';
import { fetchUsdToPhpRate, updatePortfolioWithCMC, updatePortfolioWithCoinGeckoData } from '../utils/api';
import { supabase } from '../services/supabase';
import useGlobalStore from '../store/useGlobalStore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PortfolioHeader from '../components/PortfiolioHeader';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Spinner from 'react-native-loading-spinner-overlay';
import { RefreshControl } from 'react-native-gesture-handler'
const PortfolioScreen = () => {

    const { setUsdToPhpRate } = useGlobalStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [portfolioEntries, setPortfolioEntries] = useState([]);
    const [totalHoldings, setTotalHoldings] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [simplifiedView, setSimplifiedView] = useState(false);
    const navigation = useNavigation()
    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);
    const toggleViewMode = () => setSimplifiedView(!simplifiedView);

    //fetch portfolio data
    const fetchPortfolioData = async () => {
        // setRefreshing(true);
        showLoader()

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: portfolioData, error } = await supabase
                .from('portfolio')
                .select('*')
                .eq('userId', user.id)
                .order('orderIndex', { ascending: true });

            if (error) {
                console.error('Error fetching portfolio data:', error);
            } else {
                setPortfolioEntries(portfolioData);
            }
        }
        hideLoader();
        // setRefreshing(false);
    };



    //get dollar rate to php
    const getExchangeRate = async () => {
        const rate = await fetchUsdToPhpRate();
        setUsdToPhpRate(rate);
    };


    //check if paid already
    const checkUserPaymentStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data, error } = await supabase
                .from('subscription')
                .select('isPaid')
                .eq('userId', user.id)
                .single();


            if (error) {
                console.error('Error fetching user data:', error);
                return;
            }

            if (!data?.isPaid) {
                setModalVisible(true);
            }
        }
    };



    //to fetch portfolio data
    useFocusEffect(
        React.useCallback(() => {
            // Fetch or refresh your portfolio data here
            fetchPortfolioData();
        }, [])
    );


    //get total holdings based on portfolio entries
    useEffect(() => {
        const total = portfolioEntries.reduce((acc, entry) => acc + entry.totalHoldings, 0);
        setTotalHoldings(total.toFixed(2));
    }, [portfolioEntries]);




    //initial fetch
    useEffect(() => {
        checkUserPaymentStatus();
        getExchangeRate();
    }, []);

    const refreshData = async () => {
        await fetchPortfolioData();
        // await updatePortfolioWithCoinGeckoData();

    };

    useFocusEffect(
        useCallback(() => {
            refreshData();
        }, [])
    );

    useEffect(() => {

        const interval = setInterval(updatePortfolioWithCMC, 1800000); // Fetch every 30 mins

        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                updatePortfolioWithCMC();
            }
        });

        return () => {
            clearInterval(interval);
            subscription.remove();
        };
    }, []);


    const renderItem = ({ item, index, drag, isActive }) => {

        const itemStyle = simplifiedView ? styles.itemTwoColumn : styles.itemSingleColumn;
        return (

            <CoinCard
                style={[itemStyle, { backgroundColor: isActive ? '#f0f0f0' : '#fff' }]}
                data={item}
                fetchPortfolioData={fetchPortfolioData}
                simplifiedView={simplifiedView}
                onLongPress={drag}
                isActive={isActive}
            />

        );
    };


    const ListHeaderComponent = () => (
        <View style={styles.headerContainer}>
            <PortfolioHeader title="My Portfolio" totalHoldings={totalHoldings} fetchPortfolioData={fetchPortfolioData} />
            <View style={styles.iconsContainer}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={toggleViewMode} style={styles.toggleViewButton}>
                    <MaterialIcons name={simplifiedView ? 'view-agenda' : 'view-module'} size={36} color="#6200ee" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('AddCoin')} style={styles.toggleViewButton}>
                    <MaterialIcons name="add" size={36} color="#6200ee" />
                </TouchableOpacity>
            </View>

        </View>
    );

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchPortfolioData();
            await updatePortfolioWithCMC()
        } catch (error) {
            console.error('Refreshing failed:', error);
        }
        setRefreshing(false);
    }, []);


    const onDragEnd = async ({ data }) => {
        setPortfolioEntries(data);

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            await supabase
                .from('portfolio')
                .update({ orderIndex: i })
                .match({ id: item.id });
        }

    };



    return (
        <View style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Fetching Portfolio data'}
                textStyle={styles.spinnerTextStyle}
                color={'#FFF'}
                overlayColor={'rgba(0,0,0,0.75)'}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {

                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Ionicons name="warning" size={30} color="red" />
                        <Text style={styles.modalText}>Access Denied</Text>
                        <Text>Please contact the admin to complete your payment.</Text>
                    </View>
                </View>
            </Modal>
            {portfolioEntries.length === 0 && <PortfolioHeader title="My Portfolio" totalHoldings={totalHoldings} fetchPortfolioData={fetchPortfolioData} />}
            {portfolioEntries.length === 0 ? (
                <View style={[styles.container, styles.placeholderContainer]}>
                    <Text>No coins added yet. Use the '+' button to add coins.</Text>
                </View>
            ) :
                <View style={styles.container}>
                    <DraggableFlatList
                        data={portfolioEntries}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        onDragEnd={onDragEnd}
                        numColumns={simplifiedView ? 2 : 1}
                        ListHeaderComponent={ListHeaderComponent}
                        key={simplifiedView ? 'two-columns' : 'one-column'}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }


                    />
                </View>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        flex: 1,
    },
    rateAndBudgetContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',

    },
    rateDisplay: {
        fontSize: 16,
        marginBottom: 10,
    },
    budgetInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        width: 100,
        marginRight: 8,
        fontSize: 16,
        marginTop: 10,
    },
    inputAndAddIcon: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    budgetDisplay: {
        flexDirection: 'column',
    },
    iconButton: {
        padding: 0,
    },
    placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    budgetText: {
        fontSize: 16,
        color: 'green'
    },
    budgetTitle: {
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 25,
        paddingVertical: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: 'bold',
    },
    spinnerTextStyle: {
        color: '#FFF',
        fontSize: 16,
    },
    headerContainer: {
        flexDirection: 'column',

    },
    toggleViewButton: {
        padding: 0,
        marginHorizontal: 2,
    },
    itemSingleColumn: {
        flex: 1,
    },
    itemTwoColumn: {
        width: Dimensions.get('window').width / 2 - 15,
        flex: 1 / 2,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',

        marginRight: 8,
        display: 'flex',
        flex: 1,
    },
});

export default PortfolioScreen;
