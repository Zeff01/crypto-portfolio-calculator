import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Foundation } from '@expo/vector-icons';
import useGlobalStore from '../store/useGlobalStore';

const PortfolioHeader = ({ title, totalHoldings }) => {
    const [holdingsVisible, setHoldingsVisible] = useState(true);
    const { usdToPhpRate } = useGlobalStore();
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
    },
    holdings: {
        fontSize: 16,
        color: '#666',
    },
});

export default PortfolioHeader;
