import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import CoinCard from '../components/CoinCard'
import { StickyTable }  from 'react-native-sticky-table'
import { safeToFixed } from '../utils/safeToFixed';
import useGlobalStore from '../store/useGlobalStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


const dataToParse = {
    currentPrice: 'Current Price',
    allTimeHigh: 'All Time High',
    allTimeLow: 'All Time Low',
    athRoi: 'ATH ROI',
    increaseFromATL: '% Increase from ATL',
    totalHoldings: 'Total Holdings',
    trueBudgetPerCoin: 'True Budget on this Coin',
    additionalBudget: 'Additional Budget Catch Up Bottom',
    projectedRoi:'Projected ROI (70x)',
    marketCap: 'Market Cap',
    totalSupply: 'Total Supply',
    circulatingSupply: 'Circulating Supply',
    maxSupply: 'Max Supply',
    tradingVolume:  '24h Trading Volume'
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
    isMoney: ['marketCap', 'tradingVolume'],

}

function generateTableData(data, dataToParse, exchangeRate) {
    const  result = [
        ['Shares', data.shares]
    ]
    for (k in dataToParse) {
        const value  = data[k] ?? 'N/A'
        let  item =  typeof value === 'number' ? safeToFixed(value) : value
        if (formats.isMoneyWithConversion.includes(k)) {
            item  = `$${Number(item).toLocaleString()} |  ₱${Number(safeToFixed((Number(item)*exchangeRate))).toLocaleString()}`
        }
        if (formats.isMoney.includes(k))  {
            item  = `$${Number(item).toLocaleString()}`
        }
        result.push([
            dataToParse[k], item
        ])
    }    
    return result
}

const CoinScreen = ({route}) => {
    const {usdToPhpRate} =  useGlobalStore()
    

    const data = route.params.data
    const tableData =  generateTableData(data, dataToParse, usdToPhpRate)
    console.log('---------------------------------------------')
    console.log(tableData)
    return (
        <View style={{justifyContent:'center', alignItems: 'center', backgroundColor:'white'}}>
            <View  style={{alignItems: 'center',  padding:12}}>
                <Image source={{uri:data.coinImage}} style={{width:70,  height:70}} />
                <Text style={{fontWeight: 'bold',  fontSize: 24}}>{data.coinName}</Text>
            </View>
            <ScrollView  style={{maxWidth:500, width: '90%', height:400,}}>
                {tableData.map(r => {
                    const value = r[1]

                    return (
                        <View style={{flexDirection: 'row', padding:8, marginVertical:2, width:300,  alignItems:'center', borderBottomColor:'gray',borderBottomWidth:0.5}}>
                            <View style={{width:'60%'}}><Text style={{fontWeight:'700', fontSize:16}}>{r[0]}</Text></View>
                            <View>                                
                                {typeof value ===  'string' && value.includes('|')  ?
                                <>
                                <Text>
                                    {value.substring(0,value.indexOf('|'))}
                                </Text>
                                <Text>
                                    {value.substring(value.indexOf('|')+2)}
                                </Text>
                                </>  :
                                <Text>{value}</Text>
                                }
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default CoinScreen
