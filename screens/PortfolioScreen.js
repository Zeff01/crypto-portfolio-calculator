import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCoinDataStore from '../store/useCoinDataStore';
import CoinCard from '../components/CoinCard';
import { fetchUsdToPhpRate } from '../utils/api';

const PortfolioScreen = () => {
    const [usdToPhp, setUsdToPhp] = useState(null);
    const [budgetPerCoin, setBudgetPerCoin] = useState('');
    const [isEditingBudget, setIsEditingBudget] = useState(true); // Start with editing mode if no budget is set
    const coinData = useCoinDataStore((state) => state.coinData);

    useEffect(() => {
        const getExchangeRate = async () => {
            const rate = await fetchUsdToPhpRate();
            setUsdToPhp(rate);
        };
        getExchangeRate();
    }, []);

    const handleBudgetChange = (value) => {
        setBudgetPerCoin(value);
    };

    const toggleEdit = () => {
        setIsEditingBudget(!isEditingBudget);
    };

    const budgetIconName = isEditingBudget || !budgetPerCoin ? "add" : "pencil";

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.rateAndBudgetContainer}>
                <Text style={styles.rateDisplay}>USD to PHP Rate: {usdToPhp ? usdToPhp.toFixed(2) : 'Loading...'}</Text>
                <View style={styles.budgetDisplay}>
                    {isEditingBudget ? (
                        <View style={styles.budgetInputWrapper}>
                            <Text style={styles.budgetInputLabel}>Budget (USD):</Text>
                            <TextInput
                                style={styles.budgetInput}
                                value={budgetPerCoin}
                                onChangeText={handleBudgetChange}
                                placeholder="0"
                                keyboardType="numeric"
                                onBlur={toggleEdit} // Finalize editing on blur
                            />
                        </View>
                    ) : (
                        <Text style={styles.budgetText}>
                            Budget: ₱{(budgetPerCoin * usdToPhp).toFixed(2)} / ${budgetPerCoin}
                        </Text>
                    )}
                    <TouchableOpacity onPress={toggleEdit} style={styles.iconButton}>
                        <Ionicons name={budgetIconName} size={20} color="purple" />
                    </TouchableOpacity>
                </View>
            </View>
            {coinData.length === 0 ? (
                <View style={[styles.container, styles.placeholderContainer]}>
                    <Text>No coins added yet. Use the '+' button to add coins.</Text>
                </View>
            ) : (
                coinData.map((data, index) => (
                    <CoinCard key={index} data={data} usdToPhpRate={usdToPhp} budgetPerCoin={budgetPerCoin} />
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    },
    rateAndBudgetContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    rateDisplay: {
        flex: 1,
        fontSize: 16,
    },
    budgetInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        width: 100, // Smaller width for the input field
        marginRight: 10, // Space between input and icon
        fontSize: 16,
    },
    budgetDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    iconButton: {
        padding: 10,
    },
    placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    budgetText: {
        fontSize: 16,
        color: 'green',
    },
    budgetInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    budgetInputLabel: {
        marginRight: 8,
        fontSize: 16,
    },
});

export default PortfolioScreen;
