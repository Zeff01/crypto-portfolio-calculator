import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome, Foundation, Ionicons } from '@expo/vector-icons';
import useGlobalStore from '../store/useGlobalStore';
import { supabase } from '../services/supabase';
import { useHandleTheme } from '../hooks/useTheme';
const PortfolioHeader = ({ title, totalHoldings, fetchPortfolioData }) => {
    const { colors, theme } = useHandleTheme();
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

    const handleBudgetChange = (value) => {
        const numericValue = value.replace(/[^\d.]/g, '');
        setBudget(numericValue);
    };

    //edit budget input
    const toggleEdit = () => {
        setIsEditingBudget(!isEditingBudget);
    };


    const handleBudgetUpdate = () => {
        const newBudgetValue = parseFloat(budget.replace(/,/g, ''));
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
        <View className={`mb-[20px] p-[30] rounded-[8px]`} style={{ backgroundColor: colors.card }}>
            <View style={styles.content}>
                <Text className={`text-[16px] font-[500] mb-[20px] leading-[24px] text-[${colors.text}]`}>{title}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => setHoldingsVisible(!holdingsVisible)}>
                        <FontAwesome name={holdingsVisible ? 'eye' : 'eye-slash'} size={20} color={colors.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <Foundation name="graph-pie" size={20} color={colors.icon} />
                    </TouchableOpacity>
                </View>
            </View>
            {holdingsVisible ? (
                <View style={styles.holdingsContainer}>
                    <View className='flex flex-row gap-2 items-end'>
                        <Text className={`text-[24px] font-[500] text-[${colors.text}]`}>{totalHoldings}</Text>
                        <Text className={`text-[10px] font-[400]  text-[#B4B4B4] uppercase tracking-[2px]`}>usd</Text>
                    </View>
                    <View className='flex flex-row gap-2 items-end'>
                        <Text className={`text-[24px] font-[500] text-[${colors.text}]`}>{(parseFloat(totalHoldings) * usdToPhpRate).toFixed(2)}</Text>
                        <Text className='text-[10px] font-[400]  text-[#B4B4B4] uppercase tracking-[2px]'>php</Text>
                    </View>
                </View>
            ) : (
                <Text className={`text-[16px] text-[${colors.text}] mb-10`}>******</Text>
            )}
            {isEditingBudget ? (
                <>
                    <Text style={styles.holdings}>Enter Budget in (USD)</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                        <TextInput
                            style={styles.budgetInput}
                            value={budget.toString()}
                            onChangeText={handleBudgetChange}
                            placeholder="0"
                            keyboardType="numeric"
                            returnKeyType="done"
                            onBlur={handleBudgetUpdate}
                        />

                        <TouchableOpacity onPress={handleBudgetUpdate} style={styles.iconButton}>
                            <FontAwesome name="check-circle" size={30} color="green" />
                        </TouchableOpacity>

                    </View>
                </>
            ) : (
                <View style={styles.budgetContainer}>
                    <Text className={` text-[14px] text-[${colors.text}] mb-2 font-[500] leading-[21px]`}>Your Budget:</Text>
                    <View className='flex flex-row'>
                        <Text className={` text-[14px] text-[${colors.text}] font-[500] text-center`}> {formattedBudget} / ₱{phpBudget}</Text>
                        <TouchableOpacity onPress={toggleEdit} style={styles.iconButton}>
                            <FontAwesome name="pencil-square-o" size={16} color={colors.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        marginBottom: 20,
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
        marginBottom: 35
    },
    holdings: {
        fontSize: 16,
        color: '#666',
        marginBottom: 2,
    },
    subholdings: {
        fontSize: 14,
        color: '#1E1E1E',
        marginBottom: 2,
        fontWeight: '500',
        lineHeight: 21
    },
    budgetContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2
    },
    budget: {
        fontSize: 14,
        color: '#1E1E1E',
        fontWeight: '500',
        textAlign: 'center',
    },
    iconButton: {
        marginLeft: 5,
    },
    budgetInput: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 2,
        marginTop: 5,
        width: 150
    }
});

export default PortfolioHeader;
