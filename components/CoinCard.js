import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useCoinDataStore from '../store/useCoinDataStore';

const CoinCard = ({ data, usdToPhpRate, budgetPerCoin }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedShares, setEditedShares] = useState(data.shares.toString());
    const deleteCoin = useCoinDataStore((state) => state.deleteCoin);
    const updateShares = useCoinDataStore((state) => state.updateShares);

    const handleDelete = () => {
        deleteCoin(data.id);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
    };
    const handleSave = () => {
        updateShares(data.id, editedShares);
        setIsEditing(false);
    };



    const budgetPerCoinUsd = budgetPerCoin / usdToPhpRate;
    const priceChangeIconName = data.priceChangePercentage >= 0 ? 'arrow-up' : 'arrow-down';
    const priceChangeColor = data.priceChangePercentage >= 0 ? 'green' : 'red';
    const athRoi = ((data.allTimeHigh / data.allTimeLow) - 1) * 100;
    const percentIncreaseFromAtl = ((data.currentPrice / data.allTimeLow) - 1) * 100;
    const totalHoldingsUsd = data.currentPrice * parseInt(editedShares);
    const totalHoldingsPhp = totalHoldingsUsd * usdToPhpRate;
    const trueBudgetPerCoinUsd = totalHoldingsUsd / (data.currentPrice / data.allTimeLow);
    const trueBudgetPerCoinPhp = trueBudgetPerCoinUsd * usdToPhpRate;
    const additionalBudgetUsd = (budgetPerCoinUsd - trueBudgetPerCoinUsd) > 0 ? (budgetPerCoinUsd - trueBudgetPerCoinUsd) : 0;
    const additionalBudgetPhp = additionalBudgetUsd * usdToPhpRate;
    const projectedRoiUsd = budgetPerCoin * 70;
    const projectedRoiPhp = projectedRoiUsd * usdToPhpRate;


    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Image source={{ uri: data.icon }} style={styles.icon} />
                <Text style={styles.cardTitle}>{data.name}</Text>
                <MaterialCommunityIcons name={priceChangeIconName} size={24} color={priceChangeColor} />
                <Text style={{ color: priceChangeColor, marginLeft: 4 }}>
                    {data.priceChangePercentage.toFixed(2)}%
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
                        value={editedShares}
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
                    <Text style={styles.tableCellValue}>${data.currentPrice.toFixed(2)} | ₱{(data.currentPrice * usdToPhpRate).toFixed(2)}</Text>
                </View>

                {/* All Time High */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>All Time High:</Text>
                    <Text style={styles.tableCellValue}>${data.allTimeHigh.toFixed(2)} | ₱{(data.allTimeHigh * usdToPhpRate).toFixed(2)}</Text>
                </View>

                {/* All Time Low */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>All Time Low:</Text>
                    <Text style={styles.tableCellValue}>${data.allTimeLow.toFixed(2)} | ₱{(data.allTimeLow * usdToPhpRate).toFixed(2)}</Text>
                </View>

                {/* ATH ROI */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>ATH ROI:</Text>
                    <Text style={styles.tableCellValue}>{athRoi.toFixed(2)}%</Text>
                </View>

                {/* % Increase from ATL */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>% Increase from ATL:</Text>
                    <Text style={styles.tableCellValue}>{percentIncreaseFromAtl.toFixed(2)}%</Text>
                </View>

                {/* Total Holdings */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Total Holdings:</Text>
                    <Text style={styles.tableCellValue}>${totalHoldingsUsd.toFixed(2)} | ₱{totalHoldingsPhp.toFixed(2)}</Text>
                </View>

                {/* True Budget per Coin */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>True Budget per Coin:</Text>
                    <Text style={styles.tableCellValue}>${trueBudgetPerCoinUsd.toFixed(2)} | ₱{trueBudgetPerCoinPhp.toFixed(2)}</Text>
                </View>

                {/* Additional Budget to Catch Up Bottom */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Additional Budget to Catch Up Bottom:</Text>
                    <Text style={styles.tableCellValue}>${additionalBudgetUsd.toFixed(2)} | ₱{additionalBudgetPhp.toFixed(2)}</Text>
                </View>

                {/* Projected ROI */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellTitle}>Projected ROI:</Text>
                    <Text style={styles.tableCellValue}>${projectedRoiUsd.toFixed(2)} | ₱{projectedRoiPhp.toFixed(2)}</Text>
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
