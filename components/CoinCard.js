import React, { useEffect, useState,  useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, PanResponder, Animated } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5, AntDesign, Entypo } from '@expo/vector-icons';
import useCoinDataStore from '../store/useCoinDataStore';
import useGlobalStore from '../store/useGlobalStore';
import { safeToFixed } from '../utils/safeToFixed';
import { supabase } from '../services/supabase';
import { useNavigation } from '@react-navigation/core';
import { List } from 'react-native-paper';
import { dataToParse, generateTableData } from '../utils/formatter'
import { useTheme } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';




const CoinCard = ({ data, fetchPortfolioData, onLongPress, isActive, simplifiedView }) => {
    

    const theme = useTheme()
    const [isEditing, setIsEditing] = useState(false);
    const [editedShares, setEditedShares] = useState(data.shares.toString());
    const [budgetPerCoin, setBudgetPerCoin] = useState(0)
    const [trueBudgetPerCoin, setTrueBudgetPerCoin] = useState(0)
    const deleteCoin = useCoinDataStore((state) => state.deleteCoin);
    const { usdToPhpRate } = useGlobalStore();
    const [expanded, setExpanded] = useState(false);
    const navigation = useNavigation()

    const editedSharesNum = Number(editedShares);
    const currentPriceNum = Number(data.currentPrice);
    const formattedPriceChangePercentage = safeToFixed(data.priceChangePercentage);
    const totalHoldingsUSD = !isNaN(editedSharesNum) && !isNaN(currentPriceNum)
        ? currentPriceNum * editedSharesNum
        : 0;
    const formattedTotalHoldingsUSD = totalHoldingsUSD.toFixed(2).toString();
    const formattedTotalHoldingsPHP = safeToFixed(data.currentPrice * parseInt(editedShares) * usdToPhpRate);



    const dataTable = generateTableData(data, dataToParse, usdToPhpRate)

    function editSharesHelper(share) {
        setEditedShares(Number(share)) // fixed the NaN shares when textinput is empty
    }


    const handleDelete = () => {
        Alert.alert(
            "Delete Coin",
            "Are you sure you want to delete this coin?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        const { data: deleteResponse, error } = await supabase
                            .from('portfolio')
                            .delete()
                            .match({ id: data.id });

                        if (error) {
                            console.error('Error deleting portfolio entry:', error);
                        } else {
                            console.log('Portfolio entry deleted:', deleteResponse);
                            deleteCoin(data.id);
                            fetchPortfolioData();
                        }
                    }
                }

        
            ],
            { cancelable: false }
        );
    };


    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
          inputRange: [0, 50, 100],
          outputRange: [100, 0, -100],
        });
        return (
            <TouchableOpacity onPress={handleDelete} style={{}}>
            <AntDesign name="closecircleo" size={20} color="tomato" />
        </TouchableOpacity>
        );
      };


    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    useEffect(() => {
        // Fetch when the component mounts
        fetchBudgetAndTrueBudgetPerCoin();
    }, []);

    const fetchBudgetAndTrueBudgetPerCoin = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return;

        try {
            const { data: subscriptionData, error: subscriptionError } = await supabase
                .from('subscription')
                .select('budget')
                .eq('userId', user.id)
                .single();

            if (subscriptionError) throw subscriptionError;
            setBudgetPerCoin(subscriptionData?.budget ?? 0);

            const { data: portfolioData, error: portfolioError } = await supabase
                .from('portfolio')
                .select('trueBudgetPerCoin')
                .eq('userId', user.id)
                .eq('coinId', data.coinId);

            if (portfolioError) throw portfolioError;
            if (portfolioData && portfolioData.length > 0) {
                setTrueBudgetPerCoin(portfolioData[0].trueBudgetPerCoin);
            }

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };


    const updatePortfolioEntry = async (portfolioId, newShares, newTotalHoldings, additionalBudget) => {
        // Recalculate trueBudgetPerCoin
        const trueBudgetPerCoin = newTotalHoldings / (data.currentPrice / data.allTimeLow);

        // Update the portfolio entry with the new values
        const { data: { user } } = await supabase.auth.getUser();
        const { data: updatedData, error } = await supabase
            .from('portfolio')
            .update({
                shares: newShares,
                totalHoldings: newTotalHoldings,
                trueBudgetPerCoin: trueBudgetPerCoin,
                additionalBudget: additionalBudget
            })
            .match({ id: portfolioId, userId: user.id });

        if (error) {
            console.error('Error updating portfolio entry:', error);
            return null;
        }

        console.log('Portfolio entry updated:', updatedData);
        fetchPortfolioData();
        setIsEditing(false);
        return updatedData;
    };


    const handleSave = async () => {

        const portfolioId = data.id;
        const newShares = Number(editedShares);
        const currentPrice = Number(data.currentPrice);

        if (!isNaN(newShares) && !isNaN(currentPrice)) {
            const newTotalHoldings = newShares * currentPrice;
            const additionalBudget = budgetPerCoin - trueBudgetPerCoin
            await updatePortfolioEntry(portfolioId, newShares, newTotalHoldings, additionalBudget);


        } else {
            console.error("Invalid inputs");
        }
    };


    const handleExpand = () => setExpanded(!expanded);

    const PriceChangeIcon = data.priceChangeIcon === 'arrow-up' ?
        () => <AntDesign name="up" size={14} color="green" /> :
        () => <AntDesign name="down" size={14} color="red" />

    // some shitcoins with 0.000000112 cannot be recorded when tofixed
    const currentPrice = typeof data?.currentPrice !== 'number' ? 0 : data.currentPrice < 1 ? data.currentPrice.toFixed(2) : data.currentPrice.toFixed(2)
    const AccordionTitle = () => {
        return (
            <View style={{flexDirection:'column', rowGap:10, paddingVertical:5}}>
                {/* added fixed with so it won't move */}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 10, color: '#8E8E8E', marginBottom: 8 }}>
    $ {Number(formattedTotalHoldingsUSD).toLocaleString()}
</Text>
<Text style={{ fontSize: 10, color: '#8E8E8E' }}>
    ₱ {Number(formattedTotalHoldingsPHP).toLocaleString()}
</Text>



</View>

</View>

            </View>
        )
    };

    const RightIcon = () => {
        return (

            <View style={{ justifyContent: 'flex-end' }}>
    <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
    
        <View>
            <Text style={{ fontSize: 12, marginBottom: 6, marginTop: 4, fontWeight: 'bold' }}>$ {currentPrice}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <PriceChangeIcon />
    <Text style={{ color: data?.priceChangeColor, fontSize: 10, marginLeft: 4, fontWeight: 'bold' }}>
        {formattedPriceChangePercentage}%
    </Text>
</View>


    </View>
</View>

        )
    }


    const LeftIcon = () => (
        
        <View style={{ alignItems: 'center', flexDirection: 'row', columnGap: 12 }}>
            <View style={{ backgroundColor: '#EFEFEF', borderRadius: 8, padding: 8 }}>
    <Image
        source={{ uri: data.coinImage }}
        style={styles.icon}
    />
</View>

            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{`${data.coinSymbol}`}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>


            </View>
        </View>
      
    )

    if (simplifiedView) {
        return (
            <TouchableOpacity onLongPress={() => handleDelete()} onPress={() => navigation.navigate('CoinDetails', { data })} style={[simplifiedView && styles.simplifiedCard]}>
                <View style={{alignItems: 'center', marginBottom: 5 }}>
                <Image source={{ uri: data.coinImage }} style={styles.icon} />
                <Text style={[styles.cardTitle, { color: theme.colors.text, fontSize: 16 }]}>{data.coinName}</Text>
                </View>
                <Text style={{ color: theme.colors.text }}>
                    {/* sometimes current price is Null */}
                    ${currentPriceNum.toFixed(2)}
                </Text>

                < View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <PriceChangeIcon />
                    <Text style={{ color: data?.priceChangeColor, marginLeft: 2 }}>
                        {formattedPriceChangePercentage}%
                    </Text>
                </View >
            </TouchableOpacity>
        );
    } else {



        return (
            <Swipeable renderRightActions={renderRightActions}>

            <View style={styles.mainContainer}>
    <List.Accordion
        style={[styles.card, isActive && styles.activeCard, { height: 80, justifyContent: 'center', marginTop:5 }]}
        title={<AccordionTitle />}
        right={() => <RightIcon />}
        left={() => <LeftIcon />}
        expanded={expanded}
        onPress={() => navigation.navigate('CoinDetails', { data })}
        // onPress={handleExpand}
        onLongPress={onLongPress}
        pointerEvents='auto'
    >
                    
                </List.Accordion>
            </View>
            </Swipeable>
          


        );
    }
};


const styles = StyleSheet.create({
    mainContainer: {
        // backgroundColor: 'gray',
        position: 'relative',
        paddingVertical: 3,
        marginHorizontal: 2,
    },
    deleteButton: {
        backgroundColor: 'tomato',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '80%',
        marginTop: 10,
        borderRadius: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        padding: 8,
        paddingVertical: 0.1,
    },
    simplifiedCard: {
        padding: 10,
        width: '45%',
        height: 150,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        margin: 8,
        gap: 5,
        alignItems: 'center', // Center the content horizontally
        justifyContent: 'center', // Center the content vertically
    },
    activeCard: {
        backgroundColor: '#faf5f5',
        borderRadius: 10,
        padding: 5,
        marginBottom: 5,
        marginHorizontal: 10,
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
    },
    actionIcon: {
        marginLeft: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginVertical: 10,
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
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 10,
    },
    tableCellTitle: {
        fontWeight: 'bold',
    },
    tableCellValue: {
        textAlign: 'right',
    },

});


export default CoinCard;
