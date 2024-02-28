import { View, Text,  Image, ScrollView, } from 'react-native'
import React from 'react'
import useGlobalStore from '../store/useGlobalStore';
import { useTheme } from 'react-native-paper'
import { dataToParse, generateTableData } from '../utils/formatter';


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
