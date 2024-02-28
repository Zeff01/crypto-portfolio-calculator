import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Alert, } from 'react-native';
import { Ionicons,  FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import useCoinDataStore from '../store/useCoinDataStore';
import useGlobalStore from '../store/useGlobalStore';
import { safeToFixed } from '../utils/safeToFixed';
import { supabase } from '../services/supabase';
import { useNavigation } from '@react-navigation/core';
import { List } from 'react-native-paper';
import {dataToParse, generateTableData} from '../utils/formatter'
import { useTheme } from 'react-native-paper';

const CoinCard = ({ data, fetchPortfolioData, onLongPress, isActive }) => {

    const theme = useTheme()

    const [isEditing, setIsEditing] = useState(false);
    const [editedShares, setEditedShares] = useState(data.shares.toString());
    const deleteCoin = useCoinDataStore((state) => state.deleteCoin);
    const { usdToPhpRate, budgetPerCoin } = useGlobalStore();
    const [expanded, setExpanded] = useState(false);
    const navigation = useNavigation()

    const editedSharesNum = Number(editedShares);
    const currentPriceNum = Number(data.currentPrice);

    const formattedPriceChangePercentage = safeToFixed(data.priceChangePercentage);
    // const formattedCurrentPriceUSD = safeToFixed(data.currentPrice);
    // const formattedCurrentPricePHP = safeToFixed(data.currentPrice * usdToPhpRate);
    // const formattedAllTimeHighUSD = safeToFixed(data.allTimeHigh);
    // const formattedAllTimeHighPHP = safeToFixed(data.allTimeHigh * usdToPhpRate);
    // const formattedAllTimeLowUSD = safeToFixed(data.allTimeLow);
    // const formattedAllTimeLowPHP = safeToFixed(data.allTimeLow * usdToPhpRate);

    const totalHoldingsUSD = !isNaN(editedSharesNum) && !isNaN(currentPriceNum)
        ? currentPriceNum * editedSharesNum
        : 0;
    const formattedTotalHoldingsUSD = totalHoldingsUSD.toFixed(2).toString();
    const formattedTotalHoldingsPHP = safeToFixed(data.currentPrice * parseInt(editedShares) * usdToPhpRate);
    // const formattedTrueBudgetPerCoinUSD = safeToFixed(data.trueBudgetPerCoin);
    // const formattedTrueBudgetPerCoinPHP = safeToFixed(data.trueBudgetPerCoin * usdToPhpRate);
    // const formattedAdditionalBudgetUSD = safeToFixed(data.additionalBudget);
    // const formattedAdditionalBudgetPHP = safeToFixed(data.additionalBudget * usdToPhpRate);
    // const formattedProjectedRoiUSD = safeToFixed(data.projectedRoi);
    // const formattedProjectedRoiPHP = safeToFixed(data.projectedRoi * usdToPhpRate);
    // const formattedAthRoi = safeToFixed(data.athRoi)
    // const formattedIncreaseFromATL = safeToFixed(data.increaseFromATL)

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



    const updatePortfolioEntry = async (portfolioId, newShares, newTotalHoldings) => {

        const { data, error } = await supabase
            .from('portfolio')
            .update({
                shares: newShares,
                totalHoldings: newTotalHoldings
            })
            .match({ id: portfolioId });

        if (error) {
            console.error('Error updating portfolio entry:', error);
            return null;
        }

        console.log('Portfolio entry updated:', data);
        fetchPortfolioData()
        setIsEditing(false);
        return data;
    };


    const handleSave = async () => {
        // Assuming `data.id` is the ID of the portfolio entry and not just the coin
        const portfolioId = data.id;
        const newShares = Number(editedShares);
        const currentPrice = Number(data.currentPrice); // Ensure this is the latest price

        if (!isNaN(newShares) && !isNaN(currentPrice)) {
            const newTotalHoldings = newShares * currentPrice;
            await updatePortfolioEntry(portfolioId, newShares, newTotalHoldings);


        } else {
            console.error("Invalid inputs");
        }
    };
    const handleExpand = () => setExpanded(!expanded);
    const  PriceChangeIcon  = data.priceChangeIcon === 'arrow-up' ? 
    () => <AntDesign name="up" size={18} color="green" /> : 
    () => <AntDesign name="down" size={18} color="red" />
    const AccordionTitle = () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View>
                <Text style={[styles.cardTitle, {color: theme.colors.text}]}>{`${data.coinName}`}</Text>
                <View style={{ flexDirection: 'row', }}>
                    <PriceChangeIcon />
                    <Text style={{ color: data.priceChangeColor, marginLeft: 4, color: theme.colors.text }}>
                        {formattedPriceChangePercentage}%
                    </Text>
                </View>
            </View>
            
        </View>
    );

    const RightIcon = () => {
        return <View style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',

        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <View style={{paddingRight:10}}>
                    <Text style={{ fontSize: 12, textAlign:  'right', fontWeight:'500', color: theme.colors.text }}>$ {Number(formattedTotalHoldingsUSD).toLocaleString()}</Text>
                    <Text style={{ fontSize: 12, textAlign:  'right', fontWeight:'500', color: theme.colors.text }}>₱ {Number(formattedTotalHoldingsPHP).toLocaleString()}</Text>
                </View>
                <TouchableOpacity onPress={handleDelete} style={styles.actionIcon}>
                    <Ionicons name="trash-outline" size={24} color="tomato" />
                </TouchableOpacity>
                <TouchableOpacity onPress={(event) => navigation.navigate('Coin', { data })} style={styles.actionIcon}>
                    <FontAwesome5 name="coins" size={24} color="violet" />
                </TouchableOpacity>
            </View>
        </View>
    }

    const LeftIcon = () => (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{ uri: data.coinImage }}
                style={styles.icon}
            />
        </View>
    )


    return (
        <View style={styles.mainContainer}>
            <List.Accordion
                style={[styles.card, isActive && styles.activeCard]}
                title={<AccordionTitle />}
                right={() => <RightIcon />}
                left={() => <LeftIcon />}
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
                            style={[styles.input, {color: theme.colors.text}]}
                        />
                    ) : (
                        <View style={styles.tableRow}>
                        <Text style={[styles.tableCellTitle, {color: theme.colors.text}]}>Shares: </Text>
                            <Text style={{fontWeight:'600', color: theme.colors.text}}>{data.shares}</Text>
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
                    {dataTable.slice(1).map((data,i) => {
                        const value = data[1]
                         return (<View style={styles.tableRow} key={i}>
                            <View style={{maxWidth: '60%',}}>
                                <Text style={[styles.tableCellTitle, {color: theme.colors.text}]}>{data[0]}:</Text>
                            </View>
                            <View>
                            {typeof value === 'string' && value.includes('|') ?
                                <>
                                    <Text style={{ fontWeight: '400', textAlign: 'right', color: theme.colors.text }}>
                                        {value.substring(0, value.indexOf('|'))}
                                    </Text>
                                    <Text style={{ fontWeight: '400', textAlign: 'right', color: theme.colors.text }}>
                                        {value.substring(value.indexOf('|') + 2)}
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
        marginRight: 10,
    },
    actions: {
        flexDirection: 'row',
    },
    actionIcon: {
        marginLeft: 5,
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
        marginHorizontal:10,
        marginTop:20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 5,
        paddingRight: 10,   // paddingHorizontal wont work, need to do this
        paddingLeft: 10 // for some reason,
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
