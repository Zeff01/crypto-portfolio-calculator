import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCoinDataStore from '../store/useCoinDataStore';
import CoinCard from '../components/CoinCard';
import { fetchUsdToPhpRate } from '../utils/api';
import { supabase } from '../services/supabase';

const PortfolioScreen = () => {
    const [usdToPhpRate, setUsdToPhpRate] = useState(null);
    const [budgetPerCoin, setBudgetPerCoin] = useState('');
    const coinData = useCoinDataStore((state) => state.coinData);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [portfolioEntries, setPortfolioEntries] = useState([]);

    useEffect(() => {
        checkUserPaymentStatus();
        getExchangeRate();
        // fetchPortfolioData();
    }, []);

    // const fetchPortfolioData = async () => {
    //     const { data: { user } } = await supabase.auth.getUser()

    //     if (user) {
    //         const { data: myId } = await supabase
    //             .from('users')
    //             .select('id')
    //             .eq('email', user.email) // Match based on email
    //             .single();



    //         const { data: portfolioData, error } = await supabase
    //             .from('portfolio')
    //             .select('*')
    //             .eq('userId', myId.id);
    //         console.log("portfolioData:", portfolioData)
    //         if (error) {
    //             console.error('Error fetching portfolio data:', error);
    //         } else {
    //             setPortfolioEntries(portfolioData);
    //         }
    //     }
    // };

    const getExchangeRate = async () => {
        const rate = await fetchUsdToPhpRate();
        setUsdToPhpRate(rate);
    };

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


    useEffect(() => {
        const getExchangeRate = async () => {
            const rate = await fetchUsdToPhpRate();
            setUsdToPhpRate(rate);
        };
        getExchangeRate();
    }, []);

    const handleBudgetChange = (value) => {
        setBudgetPerCoin(value);
    };

    const toggleEdit = () => {
        setIsEditingBudget(!isEditingBudget);
    };



    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Prevent modal from being closed.
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
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.rateAndBudgetContainer}>
                    <Text style={styles.rateDisplay}>USD to PHP Rate: {usdToPhpRate || 'Loading...'}</Text>
                    <View style={styles.budgetDisplay}>
                        {isEditingBudget || !budgetPerCoin ? (
                            <>
                                <Text style={styles.budgetTitle}>Enter Budget in (USD)</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                                    <TextInput
                                        style={styles.budgetInput}
                                        value={budgetPerCoin}
                                        onChangeText={handleBudgetChange}
                                        placeholder="0"
                                        keyboardType="numeric"
                                        onBlur={() => setIsEditingBudget(false)} // Hide input after entering the budget
                                    />
                                    <TouchableOpacity onPress={toggleEdit} style={styles.iconButton}>
                                        <Ionicons name="checkmark" size={24} color="green" />
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.budgetTitle}>Your Budget per coin</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.budgetText}>
                                        Budget: ${budgetPerCoin} / ₱{(budgetPerCoin * usdToPhpRate).toFixed(2)}
                                    </Text>
                                    <TouchableOpacity onPress={toggleEdit} style={styles.iconButton}>
                                        <Ionicons name="pencil" size={24} color="purple" />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
                {/* {
                    coinData.length === 0 ? (
                        <View style={[styles.container, styles.placeholderContainer]}>
                            <Text>No coins added yet. Use the '+' button to add coins.</Text>
                        </View>
                    ) : (
                        coinData.map((data, index) => (
                            <CoinCard key={index} data={data} usdToPhpRate={usdToPhpRate} budgetPerCoin={budgetPerCoin} />
                        ))
                    )
                } */}
                {
                    portfolioEntries.length === 0 ? (
                        <View style={[styles.container, styles.placeholderContainer]}>
                            <Text>No coins added yet. Use the '+' button to add coins.</Text>
                        </View>
                    ) : (
                        portfolioEntries.map((entry, index) => (
                            // Assuming `entry` contains all the data needed by CoinCard
                            <CoinCard key={index} data={entry} usdToPhpRate={usdToPhpRate} budgetPerCoin={budgetPerCoin} />
                        ))
                    )
                }
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
    },
    rateAndBudgetContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
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
});

export default PortfolioScreen;
