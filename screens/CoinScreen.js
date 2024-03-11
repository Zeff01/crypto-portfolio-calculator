import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import useGlobalStore from '../store/useGlobalStore';
import { dataToParse, generateTableData } from '../utils/formatter';

export default function CoinScreen({ route }) {
    const { usdToPhpRate } = useGlobalStore();
    const theme = useTheme();

    const data = route.params.data;
    const tableData = generateTableData(data, dataToParse, usdToPhpRate);

    const [showFullDescription, setShowFullDescription] = useState(false);

    const truncatedDescription = data.coinDescription ? truncateDescription(data.coinDescription, 15) : '';
    const fullDescription = data.coinDescription;

    function toggleDescription() {
        setShowFullDescription(!showFullDescription);
    }

    function truncateDescription(description, maxLength) {
        const words = description.split(' ');
        if (words.length > maxLength) {
            return words.slice(0, maxLength).join(' ') + '...';
        }
        return description;
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Image source={{ uri: data.coinImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                <Text style={{ fontWeight: 'bold', fontSize: 28, color: theme.colors.text, marginTop: 10 }}>{data.coinName}</Text>
                {data.coinDescription && (
                    <>
                        <Text style={{ fontSize: 16, color: theme.colors.text, marginTop: 10, marginLeft: 30, marginRight: 30, textAlign: 'center' }}>
                            {showFullDescription ? fullDescription : truncatedDescription}
                        </Text>
                        {data.coinDescription.split(' ').length > 15 && (
                            <TouchableOpacity onPress={toggleDescription} style={{ marginTop: 10 }}>
                                <Text style={{ color: theme.colors.primary }}>
                                    {showFullDescription ? 'Show Less' : 'Show More'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>

            {tableData.map((r, index) => {
                const value = r[1];

                return (
                    <View
                        key={index}
                        style={{
                            flexDirection: 'row',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            marginHorizontal: 20,
                            marginVertical: 8,
                            backgroundColor: theme.colors.surface,
                            borderRadius: 12,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '600', fontSize: 16, color: theme.colors.primary }}>{r[0]}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            {typeof value === 'string' && value.includes('|') ? (
                                value.split('|').map((item, idx) => (
                                    <Text key={idx} style={{ fontWeight: '500', color: theme.colors.text }}>
                                        {item}
                                    </Text>
                                ))
                            ) : (
                                <Text style={{ fontWeight: '500', color: theme.colors.text }}>{value}</Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}
