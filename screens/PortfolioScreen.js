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
import { useTheme} from 'react-native-paper'
import {Picker} from '@react-native-picker/picker';
import { cloneDeep } from 'lodash';

const sortOptions = {
    default: 'default',
    percentDesc: 'percentDesc',
    percentAsc: 'percentAsc',
    gainsDesc: 'gainsDesc',
    gainsAsc: 'gainsAsc',    
}

const PortfolioScreen = () => {
    const theme = useTheme()
    const { setUsdToPhpRate } = useGlobalStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [portfolioEntries, setPortfolioEntries] = useState([]);
    const [totalHoldings, setTotalHoldings] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [simplifiedView, setSimplifiedView] = useState(false);
    const [sortBy, setSortBy] = useState('default')
    const [sortedPortfolioEntries, setSortedPortfolioEntries] = useState(portfolioEntries)
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


    // this sorts the portfolio based on sortBy state
    useEffect(() => {
        const portfolioCopy = cloneDeep(portfolioEntries)
        if (sortBy === sortOptions.default) {
            setSortedPortfolioEntries(portfolioCopy)
        }
        else if (sortBy === sortOptions.percentDesc) {
            portfolioCopy.sort((a,b) => b.priceChangePercentage - a.priceChangePercentage)
            setSortedPortfolioEntries(portfolioCopy)
        }
        else if (sortBy === sortOptions.percentAsc) {
            portfolioCopy.sort((a,b) => a.priceChangePercentage - b.priceChangePercentage)
            setSortedPortfolioEntries(portfolioCopy)
        }
        else if (sortBy === sortOptions.gainsDesc) {
            portfolioCopy.sort((a,b) => b.totalHoldings - a.totalHoldings)
            setSortedPortfolioEntries(portfolioCopy)
        }
        else if (sortBy === sortOptions.gainsAsc) {
            portfolioCopy.sort((a,b) => a.totalHoldings - b.totalHoldings)
            setSortedPortfolioEntries(portfolioCopy)
        }

    }, [sortBy])

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
                <TouchableOpacity // need to encapsulate to picker component to style it
                style={{
                    overflow:'hidden', 
                    alignItems:'center', 
                    justifyContent:'center', 
                    width:180, 
                    height:35,
                    marginRight:'auto',
                    borderRadius:10,
                    backgroundColor:theme.colors.primary,
                    elevation:3
                }}
                itemStyle={{
                    fontSize:12,
                    backgroundColor:'red'
                }}
                >

                <Picker 
                selectedValue={sortBy}                    
                onValueChange={(item) => {
                    setSortBy(item)
                }}
                mode='dropdown'
                style={{width:180,   color: 'white'}}
                dropdownIconColor={'white'}
                dropdownIconRippleColor={theme.colors.primary}                                
                >
                    <Picker.Item label="default" value={sortOptions.default} style={{backgroundColor:theme.colors.primary, fontSize:15, color: 'white',}} />
                    <Picker.Item label="percent desc" value={sortOptions.percentDesc} style={{backgroundColor:theme.colors.primary, fontSize:15, color: 'white',}} />
                    <Picker.Item label="percent asc" value={sortOptions.percentAsc} style={{backgroundColor:theme.colors.primary, fontSize:15, color: 'white',}} />
                    <Picker.Item label="total desc" value={sortOptions.gainsDesc} style={{backgroundColor:theme.colors.primary, fontSize:15, color: 'white',}} />
                    <Picker.Item label="total asc" value={sortOptions.gainsAsc} style={{backgroundColor:theme.colors.primary, fontSize:15, color: 'white',}} />
                </Picker>
                </TouchableOpacity>
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

            {/* <Modal
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
            </Modal> */}
            {portfolioEntries.length === 0 && <PortfolioHeader title="My Portfolio" totalHoldings={totalHoldings} fetchPortfolioData={fetchPortfolioData} />}
            {portfolioEntries.length === 0 ? (
                <View style={[styles.container, styles.placeholderContainer, {rowGap:10}]}>
                    <Text style={{color:theme.colors.text}}>No coins added yet.</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AddCoin')} 
                    style={[styles.toggleViewButton, 
                        {
                            flexDirection:'row', 
                            alignItems:'center',
                            backgroundColor: theme.colors.primary,
                            paddingHorizontal:10,
                            paddingVertical:4, 
                            borderRadius:10,
                            elevation:5
                        }]}
                    >  
                        <Text style={{color:'white'}}>ADD COIN</Text>
                        <MaterialIcons name="add" size={32} color="#6200ee" />
                    </TouchableOpacity>
                </View>
            ) :
                <View style={styles.container}>
                    <DraggableFlatList
                        data={sortedPortfolioEntries}
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
        backgroundColor: '#f9f9f9',
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
        justifyContent: 'flex-start',
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
        alignItems: 'center',

        marginRight: 8,
        display: 'flex',
        flex: 1,
    },
});

export default PortfolioScreen;
