import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome, Foundation, Ionicons } from '@expo/vector-icons';
import useGlobalStore from '../store/useGlobalStore';
import { supabase } from '../services/supabase';
const PortfolioHeader = ({ title, totalHoldings, fetchPortfolioData }) => {
    const [holdingsVisible, setHoldingsVisible] = useState(true);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budget, setBudget] = useState(0);
    const { usdToPhpRate } = useGlobalStore();


    useEffect(() => {
        fetchBudget();
    }, []);

    const fetchBudget = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('subscription')
                .select('budget')
                .eq('userId', user.id)
                .single();

            if (error) {
                console.error('Error fetching budget:', error);
                return;
            }

            // Set budget to fetched value or fallback to 0 if null/undefined
            setBudget(data?.budget ?? 0);
        }
    };

    const updateBudget = async (newBudget) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            console.log("user:", user)
            const { error } = await supabase
                .from('subscription')
                .update({ budget: newBudget })
                .eq('userId', user.id);

            const { data: portfolioData, error: fetchError } = await supabase
                .from('portfolio')
                .select('*')
                .eq('userId', user.id);

            if (fetchError || !portfolioData) {
                console.error('Error fetching portfolio data:', fetchError);
                return;
            }


            if (error) {
                console.error('Error updating budget:', error);
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

            fetchPortfolioData?.();
            setBudget(newBudget);
            setIsEditingBudget(false);
        }
    };

    //change budget
    const handleBudgetChange = (value) => {
        console.log("value:", value)
        const numericValue = value.replace(/[^\d.]/g, ''); // Ensure only numeric input
        setBudget(numericValue);
    };


    //edit budget input
    const toggleEdit = () => {
        setIsEditingBudget(!isEditingBudget);
    };


    const handleBudgetUpdate = () => {
        const newBudgetValue = parseFloat(budget);
        if (!isNaN(newBudgetValue) && newBudgetValue >= 0) {
            console.log('Updating budget...');
            updateBudget(newBudgetValue);
        } else {
            console.warn("Invalid budget value entered.");
            alert("Please enter a valid budget value.");
        }
    };


    let formattedBudget = budget?.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    let numericBudget = parseFloat(budget);
    if (isNaN(numericBudget) || isNaN(usdToPhpRate)) {
        // Handle error or set defaults
        numericBudget = 0; // Default or error handling
    }

    const phpBudget = (numericBudget * usdToPhpRate).toFixed(2);


    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => setHoldingsVisible(!holdingsVisible)}>
                        <FontAwesome name={holdingsVisible ? 'eye' : 'eye-slash'} size={20} color="#6200ee" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <Foundation name="graph-pie" size={20} color="#6200ee" />
                    </TouchableOpacity>
                </View>
            </View>
            {holdingsVisible ? (
                <View style={styles.holdingsContainer}>
                    <Text style={styles.holdings}>{`USD: $${totalHoldings}`}</Text>
                    <Text style={styles.holdings}>{`PHP: ₱${(parseFloat(totalHoldings) * usdToPhpRate).toFixed(2)}`}</Text>
                </View>
            ) : (
                <Text style={styles.holdings}>******</Text>
            )}
            {isEditingBudget ? (
                <>
                    <Text style={styles.holdings}>Enter Budget in (USD)</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={styles.budgetInput}
                            value={budget.toString()}
                            onChangeText={handleBudgetChange}
                            placeholder="0"
                            keyboardType="numeric"
                        />

                        <TouchableOpacity onPress={handleBudgetUpdate} style={styles.iconButton}>
                            <FontAwesome name="check-circle" size={30} color="green" />
                        </TouchableOpacity>

                    </View>
                </>
            ) : (
                <View style={styles.budgetContainer}>
                    <Text style={styles.holdings}>Your Budget:</Text>
                    <Text style={styles.budget}> {formattedBudget} / ₱{phpBudget}</Text>
                    <TouchableOpacity onPress={toggleEdit} style={styles.iconButton}>
                        <FontAwesome name="pencil-square-o" size={16} color="#585c58" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    holdingsContainer: {
        flexDirection: 'column',
        gap: 4,
        marginBottom: 2
    },
    holdings: {
        fontSize: 16,
        color: '#666',
    },
    budgetContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    budget: {
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconButton: {
        marginLeft: 5,
    }, budgetInput: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 4,
        marginRight: 2
    }
});

export default PortfolioHeader;
