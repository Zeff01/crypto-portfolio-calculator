import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import CoinCard from '../components/CoinCard'
import { StickyTable } from 'react-native-sticky-table'
import { safeToFixed } from '../utils/safeToFixed';
import useGlobalStore from '../store/useGlobalStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper'

const dataToParse = {
    currentPrice: 'Current Price',
    allTimeHigh: 'All Time High',
    allTimeLow: 'All Time Low',
    athRoi: 'ATH ROI',
    increaseFromATL: '% Increase from ATL',
    totalHoldings: 'Total Holdings',
    trueBudgetPerCoin: 'True Budget on this Coin',
    additionalBudget: 'Additional Budget Catch Up Bottom',
    projectedRoi: 'Projected ROI (70x)',
    marketCap: 'Market Cap',
    totalSupply: 'Total Supply',
    circulatingSupply: 'Circulating Supply',
    maxSupply: 'Max Supply',
    tradingVolume: '24h Trading Volume'
}

const formats = {
    isMoneyWithConversion: [
        'currentPrice',
        'allTimeHigh',
        'allTimeLow',
        'totalHoldings',
        'trueBudgetPerCoin',
        'additionalBudget',
        'projectedRoi',
    ],
    isMoney: ['marketCap', 'tradingVolume',],
    isBigNums: ['totalSupply', 'circulatingSupply', 'maxSupply']

}

function generateTableData(data, dataToParse, exchangeRate) {

    const result = [
        ['Shares', data.shares]
    ]
    for (k in dataToParse) {
        const value = data[k] ?? 'N/A'
        let item = typeof value === 'number' ? safeToFixed(value) : value
        if (formats.isMoneyWithConversion.includes(k)) {
            item = `$${Number(item).toLocaleString()} |  ₱${Number(safeToFixed((Number(item) * exchangeRate))).toLocaleString()}`
        }
        if (formats.isMoney.includes(k)) {
            item = `$${Number(item).toLocaleString()}`
        }
        if (formats.isBigNums.includes(k)) {
            item = Number(item).toLocaleString()
        }
        result.push([
            dataToParse[k], item
        ])
    }
    return result
}

export default function CoinScreen({ route }) {
    const { usdToPhpRate } = useGlobalStore()
    const theme = useTheme()

    const data = route.params.data
    const tableData = generateTableData(data, dataToParse, usdToPhpRate)
    return (
        <ScrollView style={{ paddingHorizontal: 10, paddingBottom: 10, }}>
            <View style={{ alignItems: 'center', padding: 12 }}>
                <Image source={{ uri: data.coinImage }} style={{ width: 70, height: 70 }} />
                <Text style={{ fontWeight: 'bold', fontSize: 24, color: theme.colors.text }}>{data.coinName}</Text>
            </View>

            {tableData.map(r => {
                const value = r[1]

                return (
                    <View
                        key={r[0]}
                        style={{
                            flexDirection: 'row',
                            padding: 8,
                            paddingHorizontal: 20,
                            marginVertical: 4,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottomColor: 'gray',
                            borderBottomWidth: 0.5,
                            backgroundColor: theme.colors.backdrop,
                            borderRadius: 10
                        }}
                    >
                        <View
                            style={{ width: '60%' }}>
                            <Text style={{ fontWeight: '700', fontSize: 16 }}>{r[0]}</Text>
                        </View>
                        <View>
                            {typeof value === 'string' && value.includes('|') ?
                                <>
                                    <Text style={{ fontWeight: '500', textAlign: 'right' }}>
                                        {value.substring(0, value.indexOf('|'))}
                                    </Text>
                                    <Text style={{ fontWeight: '500', textAlign: 'right' }}>
                                        {value.substring(value.indexOf('|') + 2)}
                                    </Text>
                                </> :
                                <Text style={{ fontWeight: '500', textAlign: 'right' }}>{value}</Text>
                            }
                        </View>
                    </View>
                )
            })}
        </ScrollView>
    )
}
