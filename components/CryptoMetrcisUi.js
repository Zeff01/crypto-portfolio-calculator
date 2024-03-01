import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { safeToFixed } from '../utils/safeToFixed';

const CryptoMetricsUI = ({ data }) => {
    // Destructuring the data for easy access
    const {
        total_market_cap,
        btc_dominance,
        total_volume_24h,
        total_market_cap_yesterday,
        total_volume_24h_yesterday
    } = data;

    // Helper function to format numbers into a more readable format
    const formatNumber = (num) => {
        if (num > 1e12) {
            return `${(num / 1e12).toFixed(2)}T`;
        } else if (num > 1e9) {
            return `${(num / 1e9).toFixed(2)}B`;
        } else if (num > 1e6) {
            return `${(num / 1e6).toFixed(2)}M`;
        } else {
            return `${num.toFixed(2)}`;
        }
    };

    // Calculating the percentage change of market cap
    const marketCapChange = ((total_market_cap - total_market_cap_yesterday) / total_market_cap_yesterday) * 100;
    const volumeChange = ((total_volume_24h - total_volume_24h_yesterday) / total_volume_24h_yesterday) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.metricContainer}>
                <Text style={styles.metricLabel}>Market Cap</Text>
                <Text style={styles.metricValue}>${formatNumber(total_market_cap)}</Text>
                <Text style={[styles.percentageChange, marketCapChange >= 0 ? styles.positiveChange : styles.negativeChange]}>
                    {marketCapChange.toFixed(2)}%
                </Text>
            </View>
            <View style={styles.metricContainer}>
                <Text style={styles.metricLabel}>Volume</Text>
                <Text style={styles.metricValue}>${formatNumber(total_volume_24h)}</Text>
                <Text style={[styles.percentageChange, volumeChange >= 0 ? styles.positiveChange : styles.negativeChange]}>
                    {volumeChange.toFixed(2)}%
                </Text>
            </View>
            <View style={styles.metricContainer}>
                <Text style={styles.metricLabel}>BTC Dominance</Text>
                <Text style={styles.metricValue}>{btc_dominance.toFixed(2)}%</Text>
                {/* Add percentage change calculation and Text component */}
            </View>
            {/* Repeat for other metrics */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff', // Adjust the background color as needed
    },
    metricContainer: {
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333', // Adjust the color as needed
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // Adjust the color as needed
    },
    percentageChange: {
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 5,
        padding: 5,
        marginTop: 4,
    },
    positiveChange: {
        color: 'green',
    },
    negativeChange: {
        color: 'red',
    },
    // Add more styles as needed
});

export default CryptoMetricsUI;
