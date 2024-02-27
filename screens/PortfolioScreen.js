import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Button, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCoinDataStore from '../store/useCoinDataStore';
import CoinCard from '../components/CoinCard';
import { fetchUsdToPhpRate } from '../utils/api';
import { supabase } from '../services/supabase';
import useGlobalStore from '../store/useGlobalStore';
import { useFocusEffect } from '@react-navigation/native';
import PortfolioHeader from '../components/PortfiolioHeader';
import DraggableFlatList from 'react-native-draggable-flatlist';

const PortfolioScreen = () => {

    const { setUsdToPhpRate, setBudgetPerCoin, usdToPhpRate, budgetPerCoin } = useGlobalStore();
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [portfolioEntries, setPortfolioEntries] = useState([]);
    const [totalHoldings, setTotalHoldings] = useState(0);

    //fetch portfolio data
    const fetchPortfolioData = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: portfolioData, error } = await supabase
                .from('portfolio')
                .select('*')
                .eq('userId', user.id);

            if (error) {
                console.error('Error fetching portfolio data:', error);
            } else {
                setPortfolioEntries(portfolioData);
            }
        }
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


    //initial fetch
    useEffect(() => {
        checkUserPaymentStatus();
        getExchangeRate();
        fetchPortfolioData();
    }, []);


    //to fetch portfolio data
    useFocusEffect(
        React.useCallback(() => {
            // Fetch or refresh your portfolio data here
            fetchPortfolioData();
        }, [])
    );

    //change budget
    const handleBudgetChange = (value) => {
        setBudgetPerCoin(value);
    };

    //edit budget input
    const toggleEdit = () => {
        setIsEditingBudget(!isEditingBudget);
    };

    //update budget in database and recalculate  additional budget
    const updateBudgets = async (newBudget) => {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: portfolioData, error: fetchError } = await supabase
                .from('portfolio')
                .select('*')
                .eq('userId', user.id);

            if (fetchError || !portfolioData) {
                console.error('Error fetching portfolio data:', fetchError);
                return;
            }


            portfolioData.forEach(async (entry) => {

                const additionalBudget = Math.max(newBudget - entry.trueBudgetPerCoin, 0);


                const { error: updateError } = await supabase
                    .from('portfolio')
                    .update({ additionalBudget: additionalBudget })
                    .match({ id: entry.id });


                if (updateError) {
                    console.error('Error updating portfolio entry:', updateError);
                }
            });

            // Optionally, refetch portfolio data after updates
            fetchPortfolioData();
        }
    };


    //confirms the budget update
    const handleConfirmNewBudget = () => {
        updateBudgets(budgetPerCoin).then(() => {
            setIsEditingBudget(false);
        });
    };

    const handleBudgetConfirmation = () => {
        if (isEditingBudget) {
            const newBudgetValue = parseFloat(budgetPerCoin);
            if (!isNaN(newBudgetValue) && newBudgetValue > 0) {
                handleConfirmNewBudget(newBudgetValue);
            } else {
                alert("Please enter a valid budget value.");
            }
        }
        setIsEditingBudget(!isEditingBudget);
    };


    //get total holdings based on portfolio entries
    useEffect(() => {
        const total = portfolioEntries.reduce((acc, entry) => acc + entry.totalHoldings, 0);
        setTotalHoldings(total.toFixed(2)); // Assuming you'll store this in a state
    }, [portfolioEntries]);


    const renderItem = ({ item, index, drag, isActive }) => {
        return (
            <CoinCard
                data={item}
                onLongPress={drag}
                isActive={isActive}
                fetchPortfolioData={fetchPortfolioData}
            />
        );
    };



    return (
        <>
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

            {
                portfolioEntries.length === 0 ? (
                    <View style={[styles.container, styles.placeholderContainer]}>
                        <Text>No coins added yet. Use the '+' button to add coins.</Text>
                    </View>
                ) : <DraggableFlatList
                    data={portfolioEntries}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `draggable-item-${item.id}`}
                    onDragEnd={({ data }) => setPortfolioEntries(data)}
                    ListHeaderComponent={
                        <>
                            <PortfolioHeader title="My Portfolio"
                                totalHoldings={totalHoldings} />

                            {/* //BUDGET INFO */}
                            <View style={styles.rateAndBudgetContainer}>
                                <Text style={styles.rateDisplay}>USD to PHP Rate: {usdToPhpRate || 'Loading...'}</Text>
                                <View style={styles.budgetDisplay}>
                                    {isEditingBudget ? (
                                        <>
                                            <Text style={styles.budgetTitle}>Enter Budget in (USD)</Text>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                                                <TextInput
                                                    style={styles.budgetInput}
                                                    value={budgetPerCoin.toString()}
                                                    onChangeText={handleBudgetChange}
                                                    placeholder="0"
                                                    keyboardType="numeric"
                                                    onBlur={() => setIsEditingBudget(false)}
                                                />

                                                <TouchableOpacity onPress={handleBudgetConfirmation} style={styles.iconButton}>
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
                        </>
                    }
                />
            }

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
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
