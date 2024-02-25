import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { debounce } from 'lodash';
import { fetchCoinData, fetchSearchResults } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import useCoinDataStore from '../store/useCoinDataStore';
import { supabase } from '../services/supabase';
import useGlobalStore from '../store/useGlobalStore';


const AddCoinScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [numberOfShares, setNumberOfShares] = useState('');
    const navigation = useNavigation();
    const addCoinData = useCoinDataStore((state) => state.addCoinData);
    const { usdToPhpRate, budgetPerCoin } = useGlobalStore();


    const debouncedSearch = debounce(async (query) => {
        if (!query) return setSearchResults([]);
        const results = await fetchSearchResults(query);
        setSearchResults(results);
    }, 500);

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm]);

    const handleSelectCoin = async (coin) => {
        // Set selected coin's data
        setSelectedCoin(coin);
        // No need to fetch and add coin data here as it will be handled in handleConfirm
    };

    // const handleConfirm = async () => {
    //     if (selectedCoin && numberOfShares) {
    //         const coinDetails = await fetchCoinData(selectedCoin.id);
    //         if (coinDetails) {
    //             addCoinData({
    //                 ...coinDetails,
    //                 shares: numberOfShares,
    //             });
    //             setSelectedCoin(null);
    //             setNumberOfShares('');
    //             navigation.goBack();
    //         }
    //     }
    // };

    const handleConfirm = async () => {
        if (selectedCoin && numberOfShares) {


            const coinDetails = await fetchCoinData(selectedCoin.id);

            if (!coinDetails) {
                console.error("Failed to fetch coin details.");
                return;
            }

            // Calculations
            const priceChangeIcon = coinDetails.priceChangePercentage >= 0 ? 'arrow-up' : 'arrow-down';
            const priceChangeColor = coinDetails.priceChangePercentage >= 0 ? 'green' : 'red';
            const athRoi = ((coinDetails.allTimeHigh / coinDetails.allTimeLow) - 1) * 100;
            const percentIncreaseFromAtl = ((coinDetails.currentPrice / coinDetails.allTimeLow) - 1) * 100;
            const totalHoldingsUsd = coinDetails.currentPrice * parseInt(numberOfShares);
            const trueBudgetPerCoinUsd = totalHoldingsUsd / (coinDetails.currentPrice / coinDetails.allTimeLow);
            const additionalBudgetUsd = Math.max(budgetPerCoin - trueBudgetPerCoinUsd, 0);
            const projectedRoiUsd = trueBudgetPerCoinUsd * 70;

            const { data: { user } } = await supabase.auth.getUser()

            if (user) {

                const portfolioData = {
                    userId: user.id,
                    shares: parseInt(numberOfShares, 10),
                    coinId: selectedCoin.id,
                    coinImage: selectedCoin.large,
                    coinName: selectedCoin.name,
                    marketCapRank: selectedCoin.market_cap_rank,
                    allTimeHigh: coinDetails.allTimeHigh,
                    allTimeLow: coinDetails.allTimeLow,
                    athRoi: athRoi,
                    increaseFromATL: percentIncreaseFromAtl,
                    totalHoldings: totalHoldingsUsd,
                    trueBudgetPerCoin: trueBudgetPerCoinUsd,
                    additionalBudget: additionalBudgetUsd,
                    projectedRoi: projectedRoiUsd,
                    priceChangeIcon: priceChangeIcon,
                    priceChangeColor: priceChangeColor,
                    tradingVolume: coinDetails.tradingVolume,
                    marketCap: coinDetails.marketCap,
                    maxSupply: coinDetails.maxSupply,
                    totalSupply: coinDetails.totalSupply,
                    circulatingSupply: coinDetails.circulatingSupply,
                    currentPrice: coinDetails.currentPrice,
                    priceChangePercentage: coinDetails.priceChangePercentage,

                };


                const { data, error } = await supabase.from('portfolio').insert([portfolioData]);

                if (error) {
                    console.error('Error saving portfolio data:', error);
                } else {
                    console.log('Portfolio data saved successfully:', data);
                    setSelectedCoin(null);
                    setNumberOfShares('');
                    navigation.goBack();
                }
            } else {
                console.error("User not logged in");
            }
        }
    };


    return (
        <View style={styles.container}>
            {selectedCoin ? (
                <View style={styles.selectedCoinContainer}>
                    <Image source={{ uri: selectedCoin.thumb }} style={styles.icon} />
                    <Text style={styles.coinName}>{selectedCoin.name}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Number of Shares"
                        value={numberOfShares}
                        onChangeText={setNumberOfShares}
                        keyboardType="numeric"
                    />
                    <View style={styles.actionContainer}>
                        <Button mode="contained" onPress={handleConfirm} style={styles.actionButton} labelStyle={styles.buttonLabel}>
                            Confirm
                        </Button>
                        <Button mode="outlined" onPress={() => setSelectedCoin(null)} style={styles.actionButton} labelStyle={styles.buttonLabel}>
                            Cancel
                        </Button>
                    </View>
                </View>
            ) : (
                <>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for a coin..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelectCoin(item)} style={styles.resultItem}>
                                <Image source={{ uri: item.thumb }} style={styles.icon} />
                                <Text style={styles.coinName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    searchInput: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },
    coinName: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    percentageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    selectedCoinContainer: {
        alignItems: 'center',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: '40%',
        paddingVertical: 2,
        paddingHorizontal: 8,
        marginVertical: 10,
    },
    button: {
        marginTop: 10,
        width: '80%',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,

    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
    },
    buttonLabel: {
        fontSize: 12,
    },
});


export default AddCoinScreen;
