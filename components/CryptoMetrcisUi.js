import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { safeToFixed } from '../utils/safeToFixed';
import { Svg, Circle, Path } from 'react-native-svg';
import FearGreed from './FearGreed';
import { useHandleTheme } from '../hooks/useTheme';





const CryptoMetricsUI = ({ data }) => {
    const { colors, theme } = useHandleTheme();

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
            <View style={{flex: 1, marginRight: 5,}}>
    {/* Market Cap */}
            <View style={[styles.metricContainer, styles.marketCap, { backgroundColor: colors.card }]}>

            <Text style={[styles.metricLabel]}>Market Cap</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>${formatNumber(total_market_cap)}</Text>
                <Text style={[styles.percentageChange, marketCapChange.startsWith('-') ? styles.negativeChange : styles.positiveChange]}>
                    {marketCapChange}%
                </Text>
            </View>

            {/* Volume */}
            <View style={[styles.metricContainer, { backgroundColor: colors.card }]}>
                <Text style={styles.metricLabel}>Volume</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>${formatNumber(total_volume_24h)}</Text>
                <Text style={[styles.percentageChange, volumeChange.startsWith('-') ? styles.negativeChange : styles.positiveChange]}>
                    {volumeChange}%
                </Text>
            </View>
            </View>
        <View style={{flex: 1, marginLeft: 5,}}>
              {/* BTC Dominance */}
          <View style={[styles.metricContainer, { backgroundColor: colors.card }]}>
                <Text style={styles.metricLabel}>BTC Dominance</Text>
                <Text style={[styles.metricValue, { color: colors.text }]}>{safeToFixed(data.btc_dominance)}%</Text>
                <Text style={[styles.percentageChange, btcDominanceChange.startsWith('-') ? styles.negativeChange : styles.positiveChange]}>
                    {btcDominanceChange}%
                </Text>
            </View>
              {/* Fear and Greed */}
            <View style={[styles.metricContainer, styles.fearGreed, { backgroundColor: colors.card }]}>
                <Text style={styles.metricLabel}>Fear & Greed</Text>  
                {/* need data for fear and greed */}
                {/* <FearGreed data={safeToFixed(data.btc_dominance)}/>  */}
                <Text style={[styles.metricValue, { color: colors.text }]}>{safeToFixed(data.btc_dominance)}%</Text>
            </View>
        </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        

    },
    metricContainer: {
        alignItems: 'left',
        paddingTop: 20,
        padding: 20,
        position: 'relative',
        paddingVertical: 10,
        width : '100%',
        backgroundColor: 'rgba(236, 236, 236, 0.08)',
        // elevation: 2,
        justifyContent : 'center',
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1, 
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    metricLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#B4B4B4',
        marginBottom: 10,
    },

    metricValue: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
    },
    percentageChange: {
        fontSize: 14,
        fontWeight: '600',
        borderRadius: 5,
        padding: 5,
        marginTop: 4,
        textAlign: 'right'
    },
    positiveChange: {
        color: '#02F5C3',
    },
    negativeChange: {
        color: '#FF2E2E',
    },
    
    fearGreedPercent: {
        position: 'absolute',
        top: 50,
        left: 55,
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
    },
    marketCap:{
        borderTopLeftRadius : 10,
        borderBottomLeftRadius : 10,
        paddingTop: 20,
        color: 'white'
    },
    fearGreed:{
        borderTopRightRadius : 10,
        borderBottomRightRadius : 10,
        paddingBottom: 45,
       
    }
});

export default CryptoMetricsUI;