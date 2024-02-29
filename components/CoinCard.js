import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import useCoinDataStore from '../store/useCoinDataStore';
import useGlobalStore from '../store/useGlobalStore';
import { safeToFixed } from '../utils/safeToFixed';
import { supabase } from '../services/supabase';
import { useNavigation } from '@react-navigation/core';
import { List } from 'react-native-paper';
import { dataToParse, generateTableData } from '../utils/formatter'
import { useTheme } from 'react-native-paper';

const CoinCard = ({ data, fetchPortfolioData, onLongPress, isActive }) => {
    const theme = useTheme()
    const [isEditing, setIsEditing] = useState(false);
    const [editedShares, setEditedShares] = useState(data.shares.toString());
    const [budgetPerCoin, setBudgetPerCoin] = useState(0)
    const [trueBudgetPerCoin, setTrueBudgetPerCoin] = useState(0)
    const deleteCoin = useCoinDataStore((state) => state.deleteCoin);
    const { usdToPhpRate } = useGlobalStore();
    const [expanded, setExpanded] = useState(false);
    const navigation = useNavigation()

    const editedSharesNum = Number(editedShares);
    const currentPriceNum = Number(data.currentPrice);
    const formattedPriceChangePercentage = safeToFixed(data.priceChangePercentage);
    const totalHoldingsUSD = !isNaN(editedSharesNum) && !isNaN(currentPriceNum)
        ? currentPriceNum * editedSharesNum
        : 0;
    const formattedTotalHoldingsUSD = totalHoldingsUSD.toFixed(2).toString();
    const formattedTotalHoldingsPHP = safeToFixed(data.currentPrice * parseInt(editedShares) * usdToPhpRate);


    const dataTable = generateTableData(data, dataToParse, usdToPhpRate)

    const handleDelete = () => {
        Alert.alert(
            "Delete Coin",
            "Are you sure you want to delete this coin?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        const { data: deleteResponse, error } = await supabase
                            .from('portfolio')
                            .delete()
                            .match({ id: data.id });

                        if (error) {
                            console.error('Error deleting portfolio entry:', error);
                        } else {
                            console.log('Portfolio entry deleted:', deleteResponse);
                            deleteCoin(data.id);
                            fetchPortfolioData();
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };
    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    useEffect(() => {
        // Fetch when the component mounts
        fetchBudgetAndTrueBudgetPerCoin();
    }, []);

    const fetchBudgetAndTrueBudgetPerCoin = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return;

        try {
            const { data: subscriptionData, error: subscriptionError } = await supabase
                .from('subscription')
                .select('budget')
                .eq('userId', user.id)
                .single();

            if (subscriptionError) throw subscriptionError;
            setBudgetPerCoin(subscriptionData?.budget ?? 0);

            const { data: portfolioData, error: portfolioError } = await supabase
                .from('portfolio')
                .select('trueBudgetPerCoin')
                .eq('userId', user.id)
                .eq('coinId', data.coinId);

            if (portfolioError) throw portfolioError;
            if (portfolioData && portfolioData.length > 0) {
                setTrueBudgetPerCoin(portfolioData[0].trueBudgetPerCoin);
            }

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };


    const updatePortfolioEntry = async (portfolioId, newShares, newTotalHoldings, additionalBudget) => {
        // Recalculate trueBudgetPerCoin
        const trueBudgetPerCoin = newTotalHoldings / (data.currentPrice / data.allTimeLow);

        // Update the portfolio entry with the new values
        const { data: { user } } = await supabase.auth.getUser();
        const { data: updatedData, error } = await supabase
            .from('portfolio')
            .update({
                shares: newShares,
                totalHoldings: newTotalHoldings,
                trueBudgetPerCoin: trueBudgetPerCoin,
                additionalBudget: additionalBudget
            })
            .match({ id: portfolioId, userId: user.id });

        if (error) {
            console.error('Error updating portfolio entry:', error);
            return null;
        }

        console.log('Portfolio entry updated:', updatedData);
        fetchPortfolioData();
        setIsEditing(false);
        return updatedData;
    };


    const handleSave = async () => {

        const portfolioId = data.id;
        const newShares = Number(editedShares);
        const currentPrice = Number(data.currentPrice);

        if (!isNaN(newShares) && !isNaN(currentPrice)) {
            const newTotalHoldings = newShares * currentPrice;
            const additionalBudget = budgetPerCoin - trueBudgetPerCoin
            await updatePortfolioEntry(portfolioId, newShares, newTotalHoldings, additionalBudget);


        } else {
            console.error("Invalid inputs");
        }
    };


    const handleExpand = () => setExpanded(!expanded);
    const PriceChangeIcon = data.priceChangeIcon === 'arrow-up' ?
        () => <AntDesign name="up" size={16} color="green" /> :
        () => <AntDesign name="down" size={16} color="red" />

    const AccordionTitle = () => {


        return (
            <View style={{width:280, rowGap:4}}>
                <View style={{ flexDirection: 'row', columnGap:10, alignItems: 'center'}}>
                    <Text style={{fontWeight:'bold',fontSize:16}}>{data.coinSymbol}</Text>
                    <View style={{ flexDirection: 'row', alignItems:'flex-end',  }}>
                        <PriceChangeIcon />
                        <Text style={{ color: data?.priceChangeColor, marginLeft: 2 }}>
                            {formattedPriceChangePercentage}%
                        </Text>

                    </View>
                    <Text style={{ paddingRight: 5, }}>${data.currentPrice.toFixed(2)}</Text>
                </View>
        < View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View   style={{flexDirection: 'row', alignItems:'center', columnGap:10}}>
                <Image source={{ uri: data.coinImage }}
                    style={styles.icon}
                />
                <View style={{}}>
                    <Text style={{ fontSize: 13, textAlign: 'left', fontWeight: '500', color: theme.colors.text }}>
                        $ {Number(formattedTotalHoldingsUSD).toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 13, textAlign: 'left', fontWeight: '500', color: theme.colors.text }}>
                        ₱ {Number(formattedTotalHoldingsPHP).toLocaleString()}
                    </Text>
                </View>
            </View>
            
            
            
            <View style={{flexDirection:'row', columnGap:5}}>
                    <TouchableOpacity onPress={(event) => navigation.navigate('Coin', { data })} style={styles.actionIcon}>
                        <FontAwesome5 name="coins" size={20} color="violet" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={styles.actionIcon}>
                        <Ionicons name="trash-outline" size={20} color="tomato" />
                    </TouchableOpacity>
                </View>

            </View >
        </View>
        )
    };

    const RightIcon = () => {
        return (
            <View style={{  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', right: -10, height:45 }}>
                <View style={{flexDirection:'row', columnGap:5}}>
                    <TouchableOpacity onPress={(event) => navigation.navigate('Coin', { data })} style={styles.actionIcon}>
                        <FontAwesome5 name="coins" size={20} color="violet" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={styles.actionIcon}>
                        <Ionicons name="trash-outline" size={20} color="tomato" />
                    </TouchableOpacity>
                </View>
                
            </View>)
    }

    const LeftIcon = () => (
        <View style={{ alignItems: 'center', justifyContent: 'center', rowGap:4, paddingLeft:10 }}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{`${data.coinSymbol}`}</Text>
            
        </View>
    )


    return (
        <View style={styles.mainContainer}>
            <List.Accordion
                style={[styles.card, isActive && styles.activeCard]}
                title={<AccordionTitle />}
                right={() => <></>}
                // left={() => <LeftIcon />}
                expanded={expanded}
                onPress={handleExpand}
                onLongPress={onLongPress}
                pointerEvents='auto'
            >
                <View style={styles.table}>
                    {/* Number of Shares */}
                    {isEditing ? (
                        <TextInput
                            value={editedShares.toString()}
                            onChangeText={setEditedShares}
                            keyboardType="numeric"
                            style={[styles.input, { color: theme.colors.text }]}
                        />
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCellTitle, { color: theme.colors.text }]}>Shares: </Text>
                            <Text style={{ fontWeight: '600', color: theme.colors.text }}>{data.shares}</Text>
                            <TouchableOpacity onPress={handleEdit} style={styles.actionIcon}>
                                <FontAwesome name="pencil-square-o" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                    )}
                    <View style={styles.actions}>
                        {isEditing &&
                            <>
                                <TouchableOpacity onPress={handleSave} style={styles.actionIcon}>
                                    <Ionicons name="checkmark-circle-outline" size={24} color="green" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCancelEdit} style={styles.actionIcon}>
                                    <Ionicons name="close-circle-outline" size={24} color="gray" />
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                    {/* removes the shares because it is redundant */}
                    {dataTable && dataTable?.slice(1).map((data, i) => {
                        const value = data[1]
                        return (<View style={styles.tableRow} key={i}>
                            <View style={{ maxWidth: '60%', }}>
                                <Text style={[styles.tableCellTitle, { color: theme.colors.text }]}>{data[0]}:</Text>
                            </View>
                            <View>
                                {typeof value === 'string' && value.includes('|') ?
                                    <>
                                        <Text style={{ fontWeight: '400', textAlign: 'right', color: theme.colors.text }}>
                                            {value.substring(0, value.indexOf('|'))}
                                        </Text>
                                        <Text style={{ fontWeight: '400', textAlign: 'right', color: theme.colors.text }}>
                                            {value.substring(value.indexOf('|') + 1)}
                                        </Text>
                                    </> :
                                    <Text style={{ fontWeight: '400', textAlign: 'right', color: theme.colors.text }}>{value}</Text>
                                }
                            </View>
                        </View>)
                    })}
                </View>
            </List.Accordion>
        </View>


    );
};


const styles = StyleSheet.create({
    mainContainer: {
        // backgroundColor: 'white',
        position: 'relative',
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        padding: 5,

    },
    activeCard: {
        backgroundColor: '#faf5f5',
        borderRadius: 10,
        padding: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
    },
    actionIcon: {
        marginLeft: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    priceLabel: {
        fontWeight: 'bold',
    },
    table: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        marginHorizontal: 10,
        marginTop: 20,
        marginHorizontal: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 5,
        paddingRight: 10,
        paddingLeft: 10
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 8,
    },
    tableCellTitle: {
        fontWeight: 'bold',
    },
    tableCellValue: {
        textAlign: 'right',
    },
});


export default CoinCard;
