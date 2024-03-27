import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  PanResponder,
  Animated,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import useCoinDataStore from "../store/useCoinDataStore";
import useGlobalStore from "../store/useGlobalStore";
import { safeToFixed } from "../utils/safeToFixed";
import { supabase } from "../services/supabase";
import { useNavigation } from "@react-navigation/core";
import { List } from "react-native-paper";
import { dataToParse, generateTableData } from "../utils/formatter";
import { useTheme } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { useHandleTheme } from "../hooks/useTheme";

const CoinCard = ({
  data,
  fetchPortfolioData,
  onLongPress,
  isActive,
  simplifiedView,
}) => {
  const initialValue =
    data.shares !== null && data.shares !== undefined
      ? data.shares.toString()
      : "";
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedShares, setEditedShares] = useState(initialValue);
  const [budgetPerCoin, setBudgetPerCoin] = useState(0);
  const [trueBudgetPerCoin, setTrueBudgetPerCoin] = useState(0);
  const deleteCoin = useCoinDataStore((state) => state.deleteCoin);
  const { usdToPhpRate } = useGlobalStore();
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const { colors } = useHandleTheme();

  const editedSharesNum = Number(editedShares);
  const currentPriceNum = Number(data.currentPrice);
  const formattedPriceChangePercentage = safeToFixed(
    data.priceChangePercentage
  );
  const totalHoldingsUSD =
    !isNaN(editedSharesNum) && !isNaN(currentPriceNum)
      ? currentPriceNum * editedSharesNum
      : 0;
  const formattedTotalHoldingsUSD = totalHoldingsUSD.toString();
  const formattedTotalHoldingsPHP = safeToFixed(
    data.currentPrice * parseInt(editedShares) * usdToPhpRate
  );

  

  const handleDelete = () => {
    Alert.alert(
      "Delete Coin",
      "Are you sure you want to delete this coin?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const { data: deleteResponse, error } = await supabase
              .from("portfolio")
              .delete()
              .match({ id: data.id });

            if (error) {
              console.error("Error deleting portfolio entry:", error);
            } else {
              console.log("Portfolio entry deleted:", deleteResponse);
              deleteCoin(data.id);
              fetchPortfolioData();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1], // Keep the box static but you can adjust this based on your needs
    });
  
    return (
      <Animated.View style={{ 
        transform: [{ translateX: trans }],
        backgroundColor: 'tomato', 
        justifyContent: 'center', 
        padding: 5, 
        borderRadius: 5,
        margin: 5,
        flexDirection: 'row',
        height: 70,
        marginTop: 12
      }}>
        <TouchableOpacity onPress={handleDelete} style={{ flexDirection: 'row', alignItems: 'center', }}>
          <AntDesign name="closecircleo" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 5,}}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("subscription")
          .select("budget")
          .eq("userId", user.id)
          .single();

      if (subscriptionError) throw subscriptionError;
      setBudgetPerCoin(subscriptionData?.budget ?? 0);

      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolio")
        .select("trueBudgetPerCoin")
        .eq("userId", user.id)
        .eq("coinId", data.coinId);

      if (portfolioError) throw portfolioError;
      if (portfolioData && portfolioData.length > 0) {
        setTrueBudgetPerCoin(portfolioData[0].trueBudgetPerCoin);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const PriceChangeIcon =
    data.priceChangeIcon === "arrow-up"
      ? () => <AntDesign name="up" size={14} color="green" />
      : () => <AntDesign name="down" size={14} color="red" />;

  // some shitcoins with 0.000000112 cannot be recorded when tofixed
  const currentPrice =
    typeof data?.currentPrice !== "number"
      ? 0
      : data.currentPrice < 1
      ? data.currentPrice.toFixed(5)
      : data.currentPrice.toFixed(5);
      
  const AccordionTitle = () => {
    return (
      <View style={{ flexDirection: "column", rowGap: 10, paddingVertical: 5 }}>
        {/* added fixed with so it won't move */}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "column" }}>
          <Text style={{ fontSize: 12, color: theme.colors.text,   marginBottom: 8 }}>
            $ {Number(formattedTotalHoldingsUSD).toLocaleString()}
          </Text>
          <Text style={{ fontSize: 10, color: theme.colors.text }}>
              ₱ {Number(formattedTotalHoldingsPHP).toLocaleString()}
          </Text>
          </View>
        </View>
      </View>
    );
  };

  const RightIcon = () => {
    return (
      <View style={{ justifyContent: "flex-end" }}>
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <View>
            <Text
              style={{
                fontSize: 12,
                marginBottom: 6,
                marginTop: 4,
                fontWeight: "bold",
                color: theme.colors.text
              }}
            >
              $ {currentPrice}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <PriceChangeIcon />
            <Text
              style={{
                color: data?.priceChangeColor,
                fontSize: 10,
                marginLeft: 4,
                fontWeight: "bold",
              }}
            >
              {formattedPriceChangePercentage}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const LeftIcon = () => {
    return (
      <View style={{ position: 'relative', width:80,  marginLeft: 8 }}> 
        <View >
          <View style={{ position: 'absolute' }}>
            <Image source={{ uri: data.coinImage }} style={styles.icon} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.colors.text, marginTop: 35, marginLeft: 4}]}>
            {data.coinSymbol}
          </Text>
        </View>
      </View>
    );
  };
  
  
  

  if (simplifiedView) {
    return (
      <TouchableOpacity
        onLongPress={() => handleDelete()}
        onPress={() => navigation.navigate("CoinDetails", { data })}
        style={[simplifiedView && styles.simplifiedCard, { backgroundColor: colors.coin } ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1,  marginBottom: 2}}>
          <Image source={{ uri: data.coinImage }} style={[styles.icon, { width: 25, height: 25, marginRight: 4 }]} /> 
          <Text style={[styles.cardTitle, { color: theme.colors.text, fontSize: 14, fontWeight: 400 }]}>
          {data.coinName}
          </Text>
        </View>

        <Text style={{ color: theme.colors.text, justifyContent: 'flex-start', flex: 1, fontWeight: 400, marginLeft: 30 }}>
          {/* ${currentPriceNum.toFixed(2)} */}
          ₱ {Number(formattedTotalHoldingsPHP).toLocaleString()}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'flex-start', marginLeft: 30  }}>
          <PriceChangeIcon />
          <Text style={{ color: data?.priceChangeColor, marginLeft: 2 }}>
            {formattedPriceChangePercentage}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.mainContainer}>
          <List.Accordion
            style={[
              styles.card,
              isActive && styles.activeCard,
              {
                height: 80,
                justifyContent: "center",
                marginTop: 5,
                paddingLeft:15,
                backgroundColor: colors.coin,
              },
            ]}
            title={<AccordionTitle />}
            right={() => <RightIcon />}
            left={() => <LeftIcon />}
            expanded={expanded}
            onPress={() => navigation.navigate("CoinDetails", { data })}
            // onPress={handleExpand}
            onLongPress={onLongPress}
            pointerEvents="auto"
          ></List.Accordion>
        </View>
      </Swipeable>
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: 'gray',
    position: "relative",
    paddingVertical: 3,
    marginHorizontal: 1.5,
     
  },
  deleteButton: {
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "80%",
    marginTop: 10,
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 8,
    paddingVertical: 0.1,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  simplifiedCard: {
    padding: 10,
    width: "47%",
    height: 100,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 6,
    gap: 5,
    // flex: 1,
    padding: 16,
    // alignItems: "center", // Center the content horizontally
    justifyContent: "flex-start", // Center the content vertically
  },
  activeCard: {
    backgroundColor: "#faf5f5",
    borderRadius: 10,
    padding: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginBottom: 5
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
  },
  actionIcon: {
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  priceLabel: {
    fontWeight: "bold",
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  tableCellTitle: {
    fontWeight: "bold",
  },
  tableCellValue: {
    textAlign: "right",
  },
});

export default CoinCard;
