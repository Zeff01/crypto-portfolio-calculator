import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { safeToFixed } from '../utils/safeToFixed';



const CryptoMetricsUI = ({ data }) => {



    if (!data || !data.quote || !data.quote.USD) {

        // Render a placeholder or nothing if the data is not ready
        return <Text>Loading...</Text>;
    }
    const {
        total_market_cap,
        total_volume_24h,
        btc_dominance
    } = data.quote.USD;

    // Helper function to format numbers into a more readable format
    const formatNumber = (num) => {
        if (num > 1e12) {
            return `${safeToFixed(num / 1e12)}T`;
        } else if (num > 1e9) {
            return `${safeToFixed(num / 1e9)}B`;
        } else if (num > 1e6) {
            return `${safeToFixed(num / 1e6)}M`;
        } else {
            return safeToFixed(num);
        }
    };

    const calculatePercentageChange = (current, previous) => {
        if (typeof current !== 'number' || typeof previous !== 'number' || previous === 0) {
            return 'N/A'; // Return 'N/A' or some other placeholder if the calculation cannot be performed
        }
        return safeToFixed(((current - previous) / previous) * 100);
    };



    // Calculating the percentage changes
    const marketCapChange = safeToFixed(((data.quote.USD.total_market_cap - data.quote.USD.total_market_cap_yesterday) / data.quote.USD.total_market_cap_yesterday) * 100);
    const volumeChange = safeToFixed(((data.quote.USD.total_volume_24h - data.quote.USD.total_volume_24h_yesterday) / data.quote.USD.total_volume_24h_yesterday) * 100);
    const btcDominanceChange = calculatePercentageChange(data.btc_dominance, data.btc_dominance_yesterday);

    return (
        <View style={styles.container}>
            {/* Market Cap */}
            <View style={styles.metricContainer}>
                <Text style={styles.metricLabel}>Market Cap</Text>
                <Text style={styles.metricValue}>${formatNumber(total_market_cap)}</Text>
                <Text style={[styles.percentageChange, marketCapChange.startsWith('-') ? styles.negativeChange : styles.positiveChange]}>
                    {marketCapChange}%
                </Text>
            </View>

            {/* Volume */}
            <View style={styles.metricContainer}>
                <Text style={styles.metricLabel}>Volume</Text>
                <Text style={styles.metricValue}>${formatNumber(total_volume_24h)}</Text>
                <Text style={[styles.percentageChange, volumeChange.startsWith('-') ? styles.negativeChange : styles.positiveChange]}>
                    {volumeChange}%
                </Text>
            </View>

            {/* BTC Dominance */}
            <View style={styles.metricContainer}>
                <Text style={styles.metricLabel}>BTC Dominance</Text>
                <Text style={styles.metricValue}>{safeToFixed(data.btc_dominance)}%</Text>
                <Text style={[styles.percentageChange, btcDominanceChange.startsWith('-') ? styles.negativeChange : styles.positiveChange]}>
                    {btcDominanceChange}%
                </Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        width: '90%'
    },
    metricContainer: {
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
});

export default CryptoMetricsUI;
