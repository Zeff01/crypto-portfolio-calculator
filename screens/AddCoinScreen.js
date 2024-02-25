import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { debounce } from 'lodash';
import { fetchCoinData, fetchSearchResults } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import useCoinDataStore from '../store/useCoinDataStore';
import { supabase } from '../services/supabase';


const AddCoinScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [numberOfShares, setNumberOfShares] = useState('');
    const navigation = useNavigation();
    const addCoinData = useCoinDataStore((state) => state.addCoinData);

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
            console.log("selectedCoin:", selectedCoin)
            // Assuming `selectedCoin` object contains all the details you need to save
            const { data: { user } } = await supabase.auth.getUser()
            console.log("user:", user.email)



            if (user) {
                const { data: myId } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', user.email) // Match based on email
                    .single();
                console.log("myId:", myId.id)

                const portfolioData = {
                    userId: myId.id,
                    shares: parseInt(numberOfShares, 10), // Ensure this is an integer
                    coinId: selectedCoin.id,
                    coinImage: selectedCoin.thumb, // Using 'thumb' for the image
                    coinName: selectedCoin.name,
                    // Assuming the following fields need to be fetched or are set to defaults as they're not in `selectedCoin`
                    allTimeHigh: 0, // Placeholder, adjust as necessary
                    allTimeLow: 0, // Placeholder, adjust as necessary
                    athRoi: 0, // Placeholder, adjust as necessary
                    increaseFromATL: 0, // Placeholder, adjust as necessary
                    totalHoldings: 0, // You might calculate this based on current price * numberOfShares
                    trueBudget: 0, // Placeholder, adjust as necessary
                    additionalBudgetToCatchUp: 0, // Placeholder, adjust as necessary
                    projectedRoi: 0, // Placeholder, adjust as necessary
                    marketCap: selectedCoin.market_cap_rank, // Using market cap rank as a placeholder
                    totalSupply: 0, // Placeholder, adjust as necessary
                    circulatingSupply: 0, // Placeholder, adjust as necessary
                    maxSupply: 0, // Placeholder, adjust as necessary
                    tradingVolume: 0, // Placeholder, adjust as necessary
                    marketCapRank: selectedCoin.market_cap_rank,
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
        width: '30%',
        padding: 10,
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
