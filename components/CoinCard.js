import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useCoinDataStore from '../store/useCoinDataStore';
import useGlobalStore from '../store/useGlobalStore';
import { safeToFixed } from '../utils/safeToFixed';
import { supabase } from '../services/supabase';

const CoinCard = ({ data, fetchPortfolioData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedShares, setEditedShares] = useState(data.shares.toString());
    const deleteCoin = useCoinDataStore((state) => state.deleteCoin);
    const { usdToPhpRate, budgetPerCoin } = useGlobalStore();

    const editedSharesNum = Number(editedShares);
    const currentPriceNum = Number(data.currentPrice);

    const formattedPriceChangePercentage = safeToFixed(data.priceChangePercentage);
    const formattedCurrentPriceUSD = safeToFixed(data.currentPrice);
    const formattedCurrentPricePHP = safeToFixed(data.currentPrice * usdToPhpRate);
    const formattedAllTimeHighUSD = safeToFixed(data.allTimeHigh);
    const formattedAllTimeHighPHP = safeToFixed(data.allTimeHigh * usdToPhpRate);
    const formattedAllTimeLowUSD = safeToFixed(data.allTimeLow);
    const formattedAllTimeLowPHP = safeToFixed(data.allTimeLow * usdToPhpRate);

    const totalHoldingsUSD = !isNaN(editedSharesNum) && !isNaN(currentPriceNum)
        ? currentPriceNum * editedSharesNum
        : 0;
    const formattedTotalHoldingsUSD = totalHoldingsUSD.toFixed(2).toString();
    const formattedTotalHoldingsPHP = safeToFixed(data.currentPrice * parseInt(editedShares) * usdToPhpRate);
    const formattedTrueBudgetPerCoinUSD = safeToFixed(data.trueBudgetPerCoin);
    const formattedTrueBudgetPerCoinPHP = safeToFixed(data.trueBudgetPerCoin * usdToPhpRate);
    const formattedAdditionalBudgetUSD = safeToFixed(data.additionalBudget);
    const formattedAdditionalBudgetPHP = safeToFixed(data.additionalBudget * usdToPhpRate);
    const formattedProjectedRoiUSD = safeToFixed(data.projectedRoi);
    const formattedProjectedRoiPHP = safeToFixed(data.projectedRoi * usdToPhpRate);
    const formattedAthRoi = safeToFixed(data.athRoi)
    const formattedIncreaseFromATL = safeToFixed(data.increaseFromATL)



    const handleDelete = () => {
        deleteCoin(data.id);
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


    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Image source={{ uri: data.coinImage }} style={styles.icon} />
                <Text style={styles.cardTitle}>{data.coinName}</Text>
                <MaterialCommunityIcons name={data.priceChangeIcon} size={24} color={data?.priceChangeColor} />
                <Text style={{ color: data.priceChangeColor, marginLeft: 4 }}>
                    {formattedPriceChangePercentage}%
                </Text>
                {/* The Delete button is always visible regardless of editing state */}
                <TouchableOpacity onPress={handleDelete} style={styles.actionIcon}>
                    <Ionicons name="trash-outline" size={24} color="tomato" />
                </TouchableOpacity>
            </View>

            <View style={styles.table}>
                {/* Number of Shares */}
                {isEditing ? (
                    <TextInput
                        value={editedShares.toString()}
                        onChangeText={setEditedShares}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                ) : (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellTitle}>Shares: </Text>
                        <Text>{data.shares}</Text>
                        <TouchableOpacity onPress={handleEdit} style={styles.actionIcon}>
                            <Ionicons name="pencil-outline" size={24} color="dodgerblue" />
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


                {/* Current Price */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Current Price:</Text>
                    <Text style={styles.tableCellValue}>${formattedCurrentPriceUSD} | ₱{formattedCurrentPricePHP}</Text>
                </View>

                {/* All Time High */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>All Time High:</Text>
                    <Text style={styles.tableCellValue}>${formattedAllTimeHighUSD} | ₱{formattedAllTimeHighPHP}</Text>
                </View>

                {/* All Time Low */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>All Time Low:</Text>
                    <Text style={styles.tableCellValue}>${formattedAllTimeLowUSD} | ₱{formattedAllTimeLowPHP}</Text>
                </View>

                {/* ATH ROI */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>ATH ROI:</Text>
                    <Text style={styles.tableCellValue}>{formattedAthRoi}%</Text>
                </View>

                {/* % Increase from ATL */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>% Increase from ATL:</Text>
                    <Text style={styles.tableCellValue}>{formattedIncreaseFromATL}%</Text>
                </View>

                {/* Total Holdings */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Total Holdings:</Text>
                    <Text style={styles.tableCellValue}>${formattedTotalHoldingsUSD} | ₱{formattedTotalHoldingsPHP}</Text>
                </View>

                {/* True Budget per Coin */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>True Budget on this Coin:</Text>
                    <Text style={styles.tableCellValue}>${formattedTrueBudgetPerCoinUSD} | ₱{formattedTrueBudgetPerCoinPHP}</Text>
                </View>

                {/* Additional Budget to Catch Up Bottom */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Additional Budget to Catch Up Bottom:</Text>
                    <Text style={styles.tableCellValue}>${formattedAdditionalBudgetUSD} | ₱{formattedAdditionalBudgetPHP}</Text>
                </View>

                {/* Projected ROI */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Projected ROI (70x):</Text>
                    <Text style={styles.tableCellValue}>${formattedProjectedRoiUSD} | ₱{formattedProjectedRoiPHP}</Text>
                </View>

                {/* MarketCap */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Market Cap:</Text>
                    <Text style={styles.tableCellValue}>${data.marketCap.toLocaleString()}</Text>
                </View>

                {/* Total Supply */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Total Supply:</Text>
                    <Text style={styles.tableCellValue}>{data.totalSupply ? data.totalSupply.toLocaleString() : 'N/A'}</Text>
                </View>

                {/* Circulating Supply */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Circulating Supply:</Text>
                    <Text style={styles.tableCellValue}>{data.circulatingSupply ? data.circulatingSupply.toLocaleString() : 'N/A'}</Text>
                </View>

                {/* Max Supply */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Max Supply:</Text>
                    <Text style={styles.tableCellValue}>{data.maxSupply ? data.maxSupply.toLocaleString() : 'N/A'}</Text>
                </View>

                {/* 24h Trading Volume */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>24h Trading Volume:</Text>
                    <Text style={styles.tableCellValue}>${data.tradingVolume.toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 15,
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
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
    },
    actions: {
        flexDirection: 'row',
    },
    actionIcon: {
        marginLeft: 10,
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
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
